import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Use authenticated client
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Properly await params before accessing id
    const { id: faceId } = await Promise.resolve(params)

    if (!faceId) {
      return NextResponse.json({ error: "Face ID is required" }, { status: 400 })
    }

    console.log("🔍 Fetching saved face:", { faceId, userId: user.id })

    // Get the saved face using the authenticated client
    const { data, error } = await supabase
      .from("cutoutly_saved_faces")
      .select("*")
      .eq("id", faceId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("❌ Error fetching saved face:", error)
      return NextResponse.json({ error: "Failed to fetch saved face" }, { status: 500 })
    }

    if (!data) {
      console.error("❌ Saved face not found:", { faceId, userId: user.id })
      return NextResponse.json({ error: "Saved face not found" }, { status: 404 })
    }

    console.log("✅ Found saved face:", { 
      faceId: data.id,
      imagePath: data.face_image_path,
      userId: data.user_id 
    })

    // Verify the image exists in storage
    const { data: imageExists, error: checkError } = await supabase.storage
      .from("cutoutly")
      .list(data.face_image_path.split("/").slice(0, -1).join("/"))

    if (checkError) {
      console.error("❌ Error checking image existence:", checkError)
      return NextResponse.json({ error: "Failed to verify image" }, { status: 500 })
    }

    const imageName = data.face_image_path.split("/").pop()
    if (!imageExists?.some(file => file.name === imageName)) {
      console.error("❌ Image file not found in storage:", { 
        path: data.face_image_path,
        files: imageExists?.map(f => f.name)
      })
      return NextResponse.json({ error: "Image file not found in storage" }, { status: 404 })
    }

    // Get a fresh signed URL that won't expire
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("cutoutly")
      .createSignedUrl(data.face_image_path, 31536000) // 1 year expiration

    if (signedUrlError) {
      console.error("❌ Error creating signed URL:", signedUrlError)
      return NextResponse.json({ error: "Failed to generate image URL" }, { status: 500 })
    }

    // Create the response
    const response = NextResponse.json({
      id: data.id,
      imagePath: data.face_image_path,
      imageUrl: signedUrlData.signedUrl,
      createdAt: data.created_at,
    })

    // Add cache control headers
    response.headers.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
    )

    return response
  } catch (error) {
    console.error("❌ Error in get-saved-face API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}