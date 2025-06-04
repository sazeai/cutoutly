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

    // Use upsert to either update existing face or create new one
    const { data, error } = await supabase
      .from("cutoutly_saved_faces")
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
      console.error("Error saving face:", error)
      return NextResponse.json({ error: "Failed to save face" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      savedFaceId: data.id,
      message: "Face saved successfully",
    })
  } catch (error) {
    console.error("Error in save-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
