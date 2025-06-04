"use server"

import { createClient } from "@/utils/supabase/server"
import { v4 as uuidv4 } from "uuid"
import { headers } from "next/headers"
import { cookies } from "next/headers"

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
  console.log("🚀 Starting generateAvatar with data:", {
    style: data.style,
    expression: data.expression,
    outfitTheme: data.outfitTheme,
    size: data.size,
    hasImage: !!data.image,
    savedFaceId: data.savedFaceId
  })

  try {
    const supabase = await createClient()
    console.log("✅ Supabase client created")

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    console.log("🔑 Auth check result:", {
      hasUser: !!user,
      userId: user?.id,
      authError: authError ? authError.message : null
    })

    if (authError || !user) {
      console.error("❌ Authentication error:", authError)
      return { success: false, error: "Unauthorized" }
    }

    // Create a new avatar entry
    console.log("📝 Creating new avatar entry...")
    const { data: avatar, error: avatarError } = await supabase
      .from("cutoutly_avatars")
      .insert({
        user_id: user.id,
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
      console.error("❌ Error creating avatar:", avatarError)
      return { success: false, error: "Failed to create avatar" }
    }
    console.log("✅ Avatar entry created:", { avatarId: avatar.id })

    // If we have a saved face ID, we don't need to upload the image
    if (data.savedFaceId) {
      console.log("🔄 Using saved face ID:", data.savedFaceId)
      // Get the saved face details
      const { data: savedFace, error: savedFaceError } = await supabase
        .from("cutoutly_saved_profile_faces")
        .select("*")
        .eq("id", data.savedFaceId)
        .single()

      if (savedFaceError) {
        console.error("❌ Error fetching saved face:", savedFaceError)
        return { success: false, error: `Failed to fetch saved face: ${savedFaceError.message}` }
      }

      if (!savedFace) {
        console.error("❌ Saved face not found")
        return { success: false, error: "Saved face not found" }
      }

      if (!savedFace.face_image_path) {
        console.error("❌ Saved face has no image path")
        return { success: false, error: "Saved face has no image path" }
      }

      console.log("✅ Saved face found:", { 
        savedFaceId: savedFace.id,
        imagePath: savedFace.face_image_path 
      })

      // Verify the image exists in storage
      const { data: imageExists, error: checkError } = await supabase.storage
        .from("cutoutly")
        .list(savedFace.face_image_path.split("/").slice(0, -1).join("/"))

      if (checkError) {
        console.error("❌ Error checking image existence:", checkError)
        return { success: false, error: `Failed to verify image: ${checkError.message}` }
      }

      const imageName = savedFace.face_image_path.split("/").pop()
      if (!imageExists?.some(file => file.name === imageName)) {
        console.error("❌ Image file not found in storage")
        return { success: false, error: "Image file not found in storage" }
      }

      // Update the avatar with the saved face path
      const { error: updateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          input_image_path: savedFace.face_image_path,
        })
        .eq("id", avatar.id)

      if (updateError) {
        console.error("❌ Error updating avatar with saved face:", updateError)
        return { success: false, error: `Failed to update avatar with saved face: ${updateError.message}` }
      }
      console.log("✅ Avatar updated with saved face path")
    } else if (data.image) {
      console.log("📤 Uploading new image...")
      // Upload the image if provided
      const arrayBuffer = await data.image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Use the correct avatars directory for profile maker images
      const fileName = `cutoutly/avatars/${user.id}/${uuidv4()}_${data.image.name.replace(/\s+/g, "_")}`
      console.log("📁 Generated file name:", fileName)

      const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, buffer, {
        contentType: data.image.type,
        upsert: false,
      })

      if (uploadError) {
        console.error("❌ Error uploading image:", uploadError)
        return { success: false, error: "Failed to upload image" }
      }
      console.log("✅ Image uploaded successfully")

      // Update the avatar with the uploaded image path
      const { error: updateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          input_image_path: fileName,
        })
        .eq("id", avatar.id)

      if (updateError) {
        console.error("❌ Error updating avatar with image path:", updateError)
        return { success: false, error: "Failed to update avatar with image path" }
      }
      console.log("✅ Avatar updated with new image path")
    } else {
      console.error("❌ No image provided")
      return { success: false, error: "No image provided" }
    }

    // Get the host from headers
    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https"
    const baseUrl = `${protocol}://${host}`
    console.log("🌐 Generated base URL:", baseUrl)

    // Get all cookies
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const cookieString = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ")
    console.log("🍪 All cookies:", allCookies.map(c => c.name))

    // Start the processing
    console.log("🚀 Starting avatar processing...")
    const processResponse = await fetch(`${baseUrl}/api/cutoutly/process-avatar/${avatar.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieString,
      },
      credentials: "include",
    })

    if (!processResponse.ok) {
      const errorText = await processResponse.text()
      console.error("❌ Error starting avatar processing:", {
        status: processResponse.status,
        statusText: processResponse.statusText,
        error: errorText
      })
      return { success: false, error: "Failed to start avatar processing" }
    }
    console.log("✅ Avatar processing started successfully")

    return { success: true, avatarId: avatar.id }
  } catch (error) {
    console.error("❌ Unexpected error in generateAvatar:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
} 