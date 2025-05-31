import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const supabase = await createClient()

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/api/cutoutly/setup-db/sql/add_user_id_to_saved_faces.sql")
    const sql = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      console.error("Error executing SQL:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "User ID column added to saved faces table" })
  } catch (error) {
    console.error("Error in add-user-id API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
