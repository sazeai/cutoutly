import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const status = searchParams.get("status") || "completed"

    // Calculate offset
    const offset = (page - 1) * limit

    // Fetch cartoons using the authenticated client
    const { data, error, count } = await supabase
      .from("cutoutly_cartoons")
      .select("*", { count: "exact" })
      .eq("status", status)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching cartoons:", error)
      return NextResponse.json({ error: "Failed to fetch cartoons" }, { status: 500 })
    }

    // Process the data to include public URLs
    const processedData = await Promise.all(
      data.map(async (cartoon) => {
        let imageUrl = null
        if (cartoon.output_image_path) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("cutoutly").getPublicUrl(cartoon.output_image_path)
          imageUrl = publicUrl
        }

        return {
          ...cartoon,
          image_url: imageUrl,
        }
      }),
    )

    return NextResponse.json({
      cartoons: processedData,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count ?? 0) / limit),
    })
  } catch (error) {
    console.error("Error in cartoons API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
