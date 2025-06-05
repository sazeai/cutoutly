import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Define params as a Promise
type Props = {
  params: Promise<{ id: string }>
}

export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  // Initialize response data
  let responseData = {
    success: false,
    message: "",
    error: null as string | null,
    deletedImageId: null as string | null
  }

  try {
    // Validate the image ID parameter
    const { id: imageId } = await params

    if (!imageId) {
      responseData.error = "Image ID is required"
      return NextResponse.json(responseData, { status: 400 })
    }

    // Get the authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      responseData.error = "Unauthorized - Please sign in to delete images"
      return NextResponse.json(responseData, { status: 401 })
    }

    // Get the image data to check ownership and get the file path
    const { data: image, error: fetchError } = await supabase
      .from("cutoutly_cartoons")
      .select("*")
      .eq("id", imageId)
      .eq("user_id", user.id)
      .single()

    if (fetchError) {
      console.error("Error fetching image:", fetchError)
      responseData.error = "Failed to fetch image details"
      return NextResponse.json(responseData, { status: 500 })
    }

    if (!image) {
      responseData.error = "Image not found or you don't have permission to delete it"
      return NextResponse.json(responseData, { status: 404 })
    }

    // Delete the image file from storage if it exists
    if (image.output_image_path) {
      try {
        const { error: storageError } = await supabase.storage
          .from("cutoutly")
          .remove([image.output_image_path])

        if (storageError) {
          console.error("Error deleting image from storage:", storageError)
          // Log the error but continue with database deletion
        }
      } catch (storageError) {
        console.error("Error in storage deletion:", storageError)
        // Log the error but continue with database deletion
      }
    }

    // Delete the image record from the database
    const { error: deleteError } = await supabase
      .from("cutoutly_cartoons")
      .delete()
      .eq("id", imageId)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("Error deleting image from database:", deleteError)
      responseData.error = "Failed to delete image from database"
      return NextResponse.json(responseData, { status: 500 })
    }

    // Success response
    responseData = {
      success: true,
      message: "Image deleted successfully",
      error: null,
      deletedImageId: imageId
    }

    return NextResponse.json(responseData, { status: 200 })

  } catch (error) {
    // Handle any unexpected errors
    console.error("Error in delete-image API:", error)
    
    responseData = {
      success: false,
      message: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      deletedImageId: null
    }

    return NextResponse.json(responseData, { status: 500 })
  }
}
