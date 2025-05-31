import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const supabaseAdmin = createServerSupabaseClient()

    // Read the SQL file
    const sqlPath = path.join(process.cwd(), "app/api/cutoutly/setup-db/sql/add_custom_prompt_field.sql")
    const sql = fs.readFileSync(sqlPath, "utf8")

    // Execute the SQL
    const { error } = await supabaseAdmin.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Custom prompt fields added successfully" })
  } catch (error) {
    console.error("Error in add-custom-prompt API:", error)
    return NextResponse.json(
      { success: false, error: `Failed to add custom prompt fields: ${error.message}` },
      { status: 500 },
    )
  }
}
