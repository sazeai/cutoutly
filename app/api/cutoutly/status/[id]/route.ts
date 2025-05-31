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

    const cartoonId = params.id

    if (!cartoonId) {
      return NextResponse.json({ error: "Cartoon ID is required" }, { status: 400 })
    }

    // Get the cartoon status using the authenticated client
    const { data, error } = await supabase
      .from("cutoutly_cartoons")
      .select("status, output_image_path, error_message, progress_stage, progress_percent")
      .eq("id", cartoonId)
      .single()

    if (error) {
      console.error("Error fetching cartoon status:", error)
      return NextResponse.json({ error: "Failed to fetch cartoon status" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Cartoon not found" }, { status: 404 })
    }

    // Get the public URL if output_image_path exists
    let imageUrl = null
    if (data.output_image_path) {
      const {
        data: { publicUrl },
      } = supabase.storage.from("cutoutly").getPublicUrl(data.output_image_path)
      imageUrl = publicUrl
    }

    return NextResponse.json({
      id: cartoonId,
      status: data.status,
      image_url: imageUrl,
      error_message: data.error_message,
      progress_stage: data.progress_stage,
      progress_percent: data.progress_percent,
    })
  } catch (error) {
    console.error("Error in cartoon status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
