import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Use authenticated client
    const supabase = await createClient()

    // Check authentication - only allow authenticated users to set up the database
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "app/api/cutoutly/setup-db/sql/create_cutoutly_tables.sql")
    const sqlQuery = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL query
    // Note: This operation requires the execute_sql RPC function to be available
    // and the user to have permission to execute it
    const { error } = await supabase.rpc("execute_sql", {
      sql_query: sqlQuery,
    })

    if (error) {
      console.error("Error setting up Cutoutly database:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Cutoutly database tables created successfully" })
  } catch (error) {
    console.error("Error in setup-db route:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}
