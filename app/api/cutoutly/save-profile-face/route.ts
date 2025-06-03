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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the image path from the request
    const { imagePath } = await request.json()

    if (!imagePath) {
      return NextResponse.json({ error: "Image path is required" }, { status: 400 })
    }

    // Create a new saved profile face entry with the user ID
    const { data, error } = await supabase
      .from("cutoutly_saved_profile_faces")
      .insert({
        face_image_path: imagePath,
        user_id: user.id, // Associate with the authenticated user
      })
      .select()
      .single()

    if (error) {
      console.error("Error saving profile face:", error)
      return NextResponse.json({ error: "Failed to save profile face" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      savedFaceId: data.id,
      message: "Profile face saved successfully",
    })
  } catch (error) {
    console.error("Error in save-profile-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 