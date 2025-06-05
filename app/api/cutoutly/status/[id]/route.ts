import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Define params as a Promise
type Props = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
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

    // Properly await params before accessing id
    const { id: cartoonId } = await params

    if (!cartoonId) {
      return NextResponse.json({ error: "Cartoon ID is required" }, { status: 400 })
    }

    // Get the cartoon status
    const { data: cartoon, error } = await supabase
      .from("cutoutly_cartoons")
      .select("*")
      .eq("id", cartoonId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching cartoon status:", error)
      return NextResponse.json({ error: "Failed to fetch cartoon status" }, { status: 500 })
    }

    if (!cartoon) {
      return NextResponse.json({ error: "Cartoon not found" }, { status: 404 })
    }

    // If cartoon is completed, include the output URL
    if (cartoon.status === "completed" && cartoon.output_image_path) {
      const { data: { publicUrl: outputUrl } } = supabase.storage
        .from("cutoutly")
        .getPublicUrl(cartoon.output_image_path)

      return NextResponse.json({
        ...cartoon,
        outputUrl,
      })
    }

    return NextResponse.json(cartoon)
  } catch (error) {
    console.error("Error in status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
