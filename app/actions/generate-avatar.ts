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
  userId: string
}

export async function generateAvatar({
  image,
  savedFaceId,
  style,
  expression,

  userId,
}: {
  image: File | null
  savedFaceId: string | null
  style: string
  expression: string
 
  userId: string
}) {
  console.log("🚀 Starting generateAvatar with data:", {
    style: style,
    expression: expression,
    hasImage: !!image,
    savedFaceId: savedFaceId
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
    
    // Define fileName before using it
    let fileName: string | null = null;
    
    // If we have a saved face ID, we don't need to upload the image
    if (savedFaceId) {
      console.log("🔄 Using saved face ID:", savedFaceId)
      // Get the saved face details
      const { data: savedFace, error: savedFaceError } = await supabase
        .from("cutoutly_saved_profile_faces")
        .select("*")
        .eq("id", savedFaceId)
        .single()

      if (savedFaceError || !savedFace) {
        console.error("❌ Error fetching saved face:", savedFaceError)
        return { success: false, error: "Failed to fetch saved face" }
      }

      // Verify the image exists in storage
      const { data: imageExists, error: checkError } = await supabase.storage
        .from("cutoutly")
        .list(savedFace.face_image_path.split("/").slice(0, -1).join("/"))

      if (checkError || !imageExists?.some(file => file.name === savedFace.face_image_path.split("/").pop())) {
        console.error("❌ Saved face image not found in storage")
        return { success: false, error: "Saved face image not found" }
      }

      fileName = savedFace.face_image_path
    } else if (image) {
      console.log("📤 Uploading new image...")
      // Upload the image if provided
      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Use the avatars directory for profile maker input images
      fileName = `cutoutly/avatars/${userId}/${uuidv4()}_${image.name.replace(/\s+/g, "_")}`
      console.log("📁 Generated file name:", fileName)

      const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, buffer, {
        contentType: image.type,
        upsert: false,
      })

      if (uploadError) {
        console.error("❌ Error uploading image:", uploadError)
        return { success: false, error: "Failed to upload image" }
      }
    }

    if (!fileName) {
      console.error("❌ No image file name available")
      return { success: false, error: "No image file name available" }
    }

    const { data: avatar, error: insertError } = await supabase
      .from("cutoutly_avatars")
      .insert({
        user_id: userId,
        input_image_path: fileName,
        style,
        expression,
        status: "initializing",
      })
      .select()
      .single()

    if (insertError) {
      console.error("❌ Error creating avatar:", insertError)
      return { success: false, error: "Failed to create avatar" }
    }
    console.log("✅ Avatar entry created:", { avatarId: avatar.id })

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