import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id: avatarId } = context.params

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the avatar
    const { data: avatar, error } = await supabase
      .from("cutoutly_avatars")
      .select("*")
      .eq("id", avatarId)
      .eq("user_id", user.id)
      .single()

    if (error || !avatar) {
      return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
    }

    // If avatar is completed, include the output URL
    if (avatar.status === "completed" && avatar.output_image_path) {
      const { data: { publicUrl: outputUrl } } = supabase.storage
        .from("cutoutly")
        .getPublicUrl(avatar.output_image_path)

      return NextResponse.json({
        ...avatar,
        outputUrl,
      })
    }

    return NextResponse.json(avatar)
  } catch (error) {
    console.error("Error in avatar API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 