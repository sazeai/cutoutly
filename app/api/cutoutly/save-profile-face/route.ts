import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Use authenticated client
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("❌ Authentication error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the image path from the request
    const { imagePath } = await request.json()

    if (!imagePath) {
      console.error("❌ No image path provided")
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    console.log("💾 Saving profile face:", { 
      userId: user.id,
      imagePath 
    })

    // Verify the image exists in storage before saving
    const { data: imageExists, error: checkError } = await supabase.storage
      .from("cutoutly")
      .list(imagePath.split("/").slice(0, -1).join("/"))

    if (checkError) {
      console.error("❌ Error checking image existence:", checkError)
      return NextResponse.json({ error: "Failed to verify image" }, { status: 500 })
    }

    const imageName = imagePath.split("/").pop()
    if (!imageExists?.some(file => file.name === imageName)) {
      console.error("❌ Image file not found in storage:", { 
        path: imagePath,
        files: imageExists?.map(f => f.name)
      })
      return NextResponse.json({ error: "Image file not found in storage" }, { status: 404 })
    }

    // Use upsert to either update existing face or create new one
    const { data, error } = await supabase
      .from("cutoutly_saved_profile_faces")
      .upsert(
        {
          user_id: user.id,
          face_image_path: imagePath,
        },
        {
          onConflict: "user_id",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (error) {
      console.error("❌ Error saving profile face:", error)
      return NextResponse.json({ error: "Failed to save profile face" }, { status: 500 })
    }

    console.log("✅ Profile face saved successfully:", { 
      savedFaceId: data.id,
      userId: data.user_id,
      imagePath: data.face_image_path
    })

    return NextResponse.json({
      success: true,
      savedFaceId: data.id,
      message: "Profile face saved successfully",
    })
  } catch (error) {
    console.error("❌ Error in save-profile-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 