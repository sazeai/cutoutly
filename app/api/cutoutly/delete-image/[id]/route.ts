import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get the image ID from the URL
    const imageId = params.id
    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Get the authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the image data to check ownership and get the file path
    const { data: image, error: fetchError } = await supabase
      .from("cutoutly_cartoons")
      .select("*")
      .eq("id", imageId)
      .eq("user_id", user.id) // Ensure the image belongs to the authenticated user
      .single()

    if (fetchError || !image) {
      console.error("Error fetching image:", fetchError)
      return NextResponse.json({ error: "Image not found or access denied" }, { status: 404 })
    }

    // Delete the image file from storage if it exists
    if (image.output_image_path) {
      const { error: storageError } = await supabase.storage.from("cutoutly").remove([image.output_image_path])

      if (storageError) {
        console.error("Error deleting image from storage:", storageError)
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete the image record from the database
    const { error: deleteError } = await supabase
      .from("cutoutly_cartoons")
      .delete()
      .eq("id", imageId)
      .eq("user_id", user.id) // Ensure the image belongs to the authenticated user

    if (deleteError) {
      console.error("Error deleting image from database:", deleteError)
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({ success: true, message: "Image deleted successfully" })
  } catch (error) {
    console.error("Error in delete-image API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
