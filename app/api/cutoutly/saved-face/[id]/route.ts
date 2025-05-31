import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Use authenticated client instead of supabaseAdmin
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const faceId = params.id

    if (!faceId) {
      return NextResponse.json({ error: "Face ID is required" }, { status: 400 })
    }

    // Get the saved face using the authenticated client
    // This will automatically respect RLS policies
    const { data, error } = await supabase
      .from("cutoutly_saved_faces")
      .select("*")
      .eq("id", faceId)
      .eq("user_id", user.id) // Ensure the face belongs to the authenticated user
      .single()

    if (error || !data) {
      console.error("Error fetching saved face:", error)
      return NextResponse.json({ error: "Saved face not found" }, { status: 404 })
    }

    // Get the public URL for the image
    const {
      data: { publicUrl },
    } = supabase.storage.from("cutoutly").getPublicUrl(data.face_image_path)

    return NextResponse.json({
      id: data.id,
      imagePath: data.face_image_path,
      imageUrl: publicUrl,
      createdAt: data.created_at,
    })
  } catch (error) {
    console.error("Error in get-saved-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
