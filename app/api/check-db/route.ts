import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if the comics table exists and has the required columns
    const { data, error } = await supabase.rpc("execute_sql", {
      sql_query: `
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'comics'
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check if we have the required columns
    const requiredColumns = [
      "id",
      "status",
      "progress_stage",
      "progress_percent",
      "error_message",
      "last_processed",
      "temp_image_path",
      "temp_result_base64",
    ]

    const missingColumns = requiredColumns.filter((col) => !data.some((row: any) => row.column_name === col))

    if (missingColumns.length > 0) {
      return NextResponse.json({
        error: `Missing required columns: ${missingColumns.join(", ")}`,
        columns: data,
        status: "incomplete",
      })
    }

    return NextResponse.json({
      message: "Database schema is correctly set up",
      columns: data,
      status: "ok",
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json({ error: "Failed to check database" }, { status: 500 })
  }
}
