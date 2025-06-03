"use server"

import { createClient } from "@/utils/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { headers } from "next/headers"

interface AvatarGenerationData {
  image: File | null
  savedFaceId?: string | null
  style: string
  expression: string
  outfitTheme: string
  size: string
  userId: string
}

export async function generateAvatar(data: AvatarGenerationData) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    // Create a new avatar entry
    const { data: avatar, error: avatarError } = await supabase
      .from("cutoutly_avatars")
      .insert({
        user_id: data.userId,
        status: "processing",
        style: data.style,
        expression: data.expression,
        outfit_theme: data.outfitTheme,
        size: data.size,
        saved_face_id: data.savedFaceId || null,
      })
      .select()
      .single()

    if (avatarError) {
      console.error("Error creating avatar:", avatarError)
      return { success: false, error: "Failed to create avatar" }
    }

    // If we have a saved face ID, we don't need to upload the image
    if (data.savedFaceId) {
      // Get the saved face details
      const { data: savedFace, error: savedFaceError } = await supabase
        .from("cutoutly_saved_profile_faces")
        .select("*")
        .eq("id", data.savedFaceId)
        .single()

      if (savedFaceError || !savedFace) {
        console.error("Error fetching saved face:", savedFaceError)
        return { success: false, error: "Failed to fetch saved face" }
      }

      // Update the avatar with the saved face path
      const { error: updateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          input_image_path: savedFace.face_image_path,
        })
        .eq("id", avatar.id)

      if (updateError) {
        console.error("Error updating avatar with saved face:", updateError)
        return { success: false, error: "Failed to update avatar with saved face" }
      }
    } else if (data.image) {
      // Upload the image if provided
      const arrayBuffer = await data.image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const fileName = `cutoutly/avatars/${user.id}/${uuidv4()}_${data.image.name.replace(/\s+/g, "_")}`

      const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, buffer, {
        contentType: data.image.type,
        upsert: false,
      })

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
        return { success: false, error: "Failed to upload image" }
      }

      // Update the avatar with the uploaded image path
      const { error: updateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          input_image_path: fileName,
        })
        .eq("id", avatar.id)

      if (updateError) {
        console.error("Error updating avatar with image path:", updateError)
        return { success: false, error: "Failed to update avatar with image path" }
      }
    } else {
      return { success: false, error: "No image provided" }
    }

    // Get the host from headers
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    // Start the processing
    const processResponse = await fetch(`${baseUrl}/api/cutoutly/process-avatar/${avatar.id}`, {
      method: "POST",
    })

    if (!processResponse.ok) {
      console.error("Error starting avatar processing:", await processResponse.text())
      return { success: false, error: "Failed to start avatar processing" }
    }

    return { success: true, avatarId: avatar.id }
  } catch (error) {
    console.error("Error in generateAvatar:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
} 