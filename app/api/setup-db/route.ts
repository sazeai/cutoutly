import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Add new columns for progress tracking
    await supabase.rpc("execute_sql", {
      sql_query: `
        -- Add size column if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'comics' AND column_name = 'size') THEN
            ALTER TABLE comics ADD COLUMN size VARCHAR(10);
          END IF;
        END $$;
        
        -- Add progress tracking columns if they don't exist
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'comics' AND column_name = 'progress_stage') THEN
            ALTER TABLE comics ADD COLUMN progress_stage VARCHAR(50);
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'comics' AND column_name = 'progress_percent') THEN
            ALTER TABLE comics ADD COLUMN progress_percent INTEGER;
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'comics' AND column_name = 'error_message') THEN
            ALTER TABLE comics ADD COLUMN error_message TEXT;
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'comics' AND column_name = 'last_processed') THEN
            ALTER TABLE comics ADD COLUMN last_processed TIMESTAMP WITH TIME ZONE;
          END IF;
        END $$;
        
        -- Set default values for existing records
        UPDATE comics 
        SET size = '1024x1024',
            progress_percent = 0
        WHERE size IS NULL;
      `,
    })

    // Add new columns for enhanced comic generation
    const { error: scriptError } = await supabase.rpc("add_comic_script_columns")

    if (scriptError) {
      console.error("Error adding comic script columns:", scriptError)
      return NextResponse.json({ error: scriptError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database setup completed" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}
