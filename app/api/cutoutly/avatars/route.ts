import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const limit = parseInt(searchParams.get("limit") || "12")
    const status = searchParams.get("status") || "completed"
    const userId = searchParams.get("userId")

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Build query
    let query = supabase
      .from("cutoutly_avatars")
      .select("*")
      .eq("user_id", userId || user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    // Add status filter if provided
    if (status) {
      query = query.eq("status", status)
    }

    // Execute query
    const { data: avatars, error } = await query

    if (error) {
      console.error("Error fetching avatars:", error)
      return NextResponse.json({ error: "Failed to fetch avatars" }, { status: 500 })
    }

    // Get public URLs for all avatars
    const avatarsWithUrls = await Promise.all(
      avatars.map(async (avatar) => {
        const { data: { publicUrl: outputUrl } } = supabase.storage
          .from("cutoutly")
          .getPublicUrl(avatar.output_image_path)

        return {
          ...avatar,
          outputUrl,
        }
      })
    )

    return NextResponse.json(avatarsWithUrls)
  } catch (error) {
    console.error("Error in avatars API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validate required fields
    const { style, expression, size, savedFaceId } = body
    if (!style || !expression || !size || !savedFaceId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the saved face
    const { data: savedFace, error: savedFaceError } = await supabase
      .from("cutoutly_saved_faces")
      .select("*")
      .eq("id", savedFaceId)
      .eq("user_id", user.id)
      .single()

    if (savedFaceError || !savedFace) {
      return NextResponse.json(
        { error: "Saved face not found" },
        { status: 404 }
      )
    }

    // Create avatar entry
    const { data: avatar, error: insertError } = await supabase
      .from("cutoutly_avatars")
      .insert({
        user_id: user.id,
        input_image_path: savedFace.face_image_path,
        style,
        expression,
        status: "initializing",
      })
      .select()
      .single()

    if (insertError) {
      console.error("Error creating avatar:", insertError)
      return NextResponse.json(
        { error: "Failed to create avatar" },
        { status: 500 }
      )
    }

    return NextResponse.json({ avatarId: avatar.id })
  } catch (error) {
    console.error("Error in avatars API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 