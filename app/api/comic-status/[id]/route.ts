import { createServerSupabaseClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

// Define the type for the params
interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const comicId = params.id

    if (!comicId) {
      return NextResponse.json({ error: "Comic ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Get the comic status
    const { data, error } = await supabase
      .from("comics")
      .select("status, comic_url, error_message, progress_stage, progress_percent")
      .eq("id", comicId)
      .single()

    if (error) {
      console.error("Error fetching comic status:", error)
      return NextResponse.json({ error: "Failed to fetch comic status" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Comic not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: comicId,
      status: data.status,
      comic_url: data.comic_url,
      error_message: data.error_message,
      progress_stage: data.progress_stage,
      progress_percent: data.progress_percent,
    })
  } catch (error) {
    console.error("Error in comic status API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}