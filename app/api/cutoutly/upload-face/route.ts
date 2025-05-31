import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase storage using the authenticated client
    const fileName = `cutoutly/saved_faces/${user.id}/${uuidv4()}_${file.name.replace(/\s+/g, "_")}`

    const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading face image:", uploadError)
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("cutoutly").getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      imagePath: fileName,
      imageUrl: publicUrl,
    })
  } catch (error) {
    console.error("Error in upload-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
