import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

// This endpoint should be called by a Vercel Cron Job
export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Get current time
    const now = new Date()

    // Find stalled comics (processing for more than 10 minutes)
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)

    const { data: stalledComics, error } = await supabase
      .from("comics")
      .select("id")
      .eq("status", "processing")
      .lt("last_processed", tenMinutesAgo.toISOString())

    if (error) {
      console.error("Error finding stalled comics:", error)
      return NextResponse.json({ error: "Failed to find stalled comics" }, { status: 500 })
    }

    // Mark stalled comics as failed
    if (stalledComics && stalledComics.length > 0) {
      const stalledIds = stalledComics.map((comic) => comic.id)

      const { error: updateError } = await supabase
        .from("comics")
        .update({
          status: "failed",
          error_message: "Comic generation stalled and timed out",
          last_processed: now.toISOString(),
        })
        .in("id", stalledIds)

      if (updateError) {
        console.error("Error updating stalled comics:", updateError)
        return NextResponse.json({ error: "Failed to update stalled comics" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: `Marked ${stalledIds.length} stalled comics as failed`,
      })
    }

    return NextResponse.json({ success: true, message: "No stalled comics found" })
  } catch (error) {
    console.error("Error in cleanup cron job:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
