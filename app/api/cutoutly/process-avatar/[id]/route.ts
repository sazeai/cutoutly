import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import openaiClient from "@/lib/openai"
import { toFile } from "openai"
import { v4 as uuidv4 } from "uuid"
import { generateAvatarPrompt } from "@/lib/cutoutly/avatar-prompt-generator"

// Track processing avatars to prevent multiple simultaneous processing
const processingAvatars = new Set<string>()

export async function POST(
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
    const { id: avatarId } = await Promise.resolve(params)

    if (!avatarId) {
      return NextResponse.json({ error: "Avatar ID is required" }, { status: 400 })
    }

    // Prevent multiple simultaneous processing of the same avatar
    if (processingAvatars.has(avatarId)) {
      return NextResponse.json({
        status: "processing",
        message: "Avatar is already being processed",
      })
    }

    // Mark this avatar as being processed
    processingAvatars.add(avatarId)

    try {
      // Get the avatar data using the authenticated client
      const { data: avatar, error } = await supabase
        .from("cutoutly_avatars")
        .select("*")
        .eq("id", avatarId)
        .eq("user_id", user.id) // Ensure the avatar belongs to the authenticated user
        .single()

      if (error || !avatar) {
        console.error("Error fetching avatar:", error)
        processingAvatars.delete(avatarId)
        return NextResponse.json({ error: "Avatar not found" }, { status: 404 })
      }

      // Check if the avatar is already completed or failed
      if (avatar.status === "completed") {
        processingAvatars.delete(avatarId)
        return NextResponse.json({ status: "completed", image_url: avatar.output_image_path })
      }

      if (avatar.status === "failed") {
        processingAvatars.delete(avatarId)
        return NextResponse.json({ status: "failed", error: avatar.error_message })
      }

      console.log(`Processing avatar ${avatarId}, current stage: ${avatar.progress_stage}`)

      // Check the current progress stage and continue from there
      let result
      switch (avatar.progress_stage) {
        case "initializing":
          result = await processGenerateAvatar(avatarId, avatar, supabase, user.id)
          break

        case "avatar_generated":
          result = await processFinalizeAvatar(avatarId, avatar, supabase, user.id)
          break

        default:
          // If we don't recognize the stage, start from the beginning
          result = await processGenerateAvatar(avatarId, avatar, supabase, user.id)
          break
      }

      processingAvatars.delete(avatarId)
      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`Error processing avatar ${avatarId}:`, errorMsg)

      // Update the avatar status to failed using the authenticated client
      await supabase
        .from("cutoutly_avatars")
        .update({
          status: "failed",
          error_message: `Processing error: ${errorMsg}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", user.id)

      processingAvatars.delete(avatarId)
      return NextResponse.json(
        {
          status: "failed",
          error: `Processing error: ${errorMsg}`,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Error in process avatar API:", errorMsg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Generate the avatar using OpenAI
async function processGenerateAvatar(avatarId: string, avatar: any, supabase: any, userId: string) {
  console.log(`🎨 Generating avatar for ${avatarId}...`)

  try {
    // Verify the input image path exists
    if (!avatar.input_image_path) {
      throw new Error("No input image path found")
    }

    // Download the input image using the authenticated client
    const { data: imageData, error: downloadError } = await supabase.storage
      .from("cutoutly")
      .download(avatar.input_image_path)

    if (downloadError) {
      console.error(`Error downloading image:`, downloadError)
      throw new Error(`Error downloading image: ${downloadError.message}`)
    }

    if (!imageData) {
      throw new Error("No image data received from storage")
    }

    // Update progress before API call using the authenticated client
    const { error: updateError } = await supabase
      .from("cutoutly_avatars")
      .update({
        progress_stage: "calling_openai",
        progress_percent: 40,
        last_processed: new Date().toISOString(),
      })
      .eq("id", avatarId)
      .eq("user_id", userId)

    if (updateError) {
      console.error(`Error updating avatar before OpenAI call:`, updateError)
      throw new Error(`Failed to update avatar before OpenAI call: ${updateError.message}`)
    }

    console.log(`✅ Updated avatar ${avatarId} to stage: calling_openai`)

    // Convert to blob
    const imageBlob = new Blob([imageData], { type: "image/png" })
    console.log(`Created image blob: size=${imageBlob.size} bytes, type=${imageBlob.type}`)

    // Verify the blob is valid
    if (imageBlob.size === 0) {
      throw new Error("Image blob is empty")
    }

    // Call OpenAI API
    console.log(`🚀 Calling OpenAI API with model: gpt-image-1, quality: medium, size: ${avatar.size}...`)

    const startApiCall = Date.now()
    try {
      // Convert the blob to a File object using toFile
      const imageFile = await toFile(imageBlob, "image.png", { type: "image/png" })
      console.log(`Converted blob to File object: name=${imageFile.name}, size=${imageFile.size} bytes`)

      // Generate the prompt
      const prompt = generateAvatarPrompt({
        style: avatar.style,
        expression: avatar.expression,
        outfitTheme: avatar.outfit_theme,
        useCase: avatar.use_case,
      })

      // Make the API call with the image as an array of File objects
      const response = await openaiClient.images.edit({
        model: "gpt-image-1",
        image: [imageFile], // Pass as an array of File objects
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "medium",
        background: "auto",
      })

      console.log(`✅ OpenAI API call completed in ${Date.now() - startApiCall}ms`)
      console.log(`Response structure:`, Object.keys(response))
      if (response?.data) {
        console.log(`Response data length:`, response.data.length)
      }
      if (!response?.data?.[0]?.b64_json) {
        throw new Error("No image data returned from OpenAI")
      }
      const imageBase64 = response.data[0].b64_json

      console.log(`Received base64 data of length: ${imageBase64.length} characters`)

      // Convert base64 to Buffer
      const imageBuffer = Buffer.from(imageBase64, "base64")
      const generatedImageBlob = new Blob([imageBuffer], { type: "image/png" })

      // Upload the generated image to Supabase using the authenticated client
      const fileName = `cutoutly/generated/${userId}/${avatarId}_${uuidv4()}.png`

      const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, generatedImageBlob, {
        contentType: "image/png",
        upsert: false,
      })

      if (uploadError) {
        console.error("❌ Error uploading generated image:", uploadError)
        throw new Error(`Failed to upload generated image: ${uploadError.message}`)
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cutoutly").getPublicUrl(fileName)

      // First update to avatar_generated stage
      const { error: stageError } = await supabase
        .from("cutoutly_avatars")
        .update({
          output_image_path: fileName,
          progress_stage: "avatar_generated",
          progress_percent: 80,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", userId)

      if (stageError) {
        console.error("❌ Error updating avatar stage:", stageError)
        throw new Error(`Failed to update avatar stage: ${stageError.message}`)
      }

      console.log("✅ Updated avatar to stage: avatar_generated")

      // Then update to completed status
      const { error: completeError } = await supabase
        .from("cutoutly_avatars")
        .update({
          status: "completed",
          progress_stage: "completed",
          progress_percent: 100,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", userId)

      if (completeError) {
        console.error("❌ Error completing avatar:", completeError)
        throw new Error(`Failed to complete avatar: ${completeError.message}`)
      }

      console.log("✅ Avatar generation completed successfully")

      return NextResponse.json({
        status: "completed",
        progress_stage: "completed",
        progress_percent: 100,
        image_url: fileName,
        message: "Avatar generated successfully",
      })
    } catch (error: any) {
      console.error(`OpenAI API error:`, error)

      // Log detailed error information
      if (error.response) {
        console.error(`OpenAI API response status: ${error.response.status}`)
        console.error(`OpenAI API response data:`, error.response.data)
      }

      throw error
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`Error generating avatar:`, error)
    throw new Error(`Failed to generate avatar: ${errorMsg}`)
  }
}

// Finalize the avatar
async function processFinalizeAvatar(avatarId: string, avatar: any, supabase: any, userId: string) {
  console.log(`✅ Finalizing avatar ${avatarId}...`)

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("cutoutly").getPublicUrl(avatar.output_image_path)

  // Update the avatar status to completed using the authenticated client
  const { error } = await supabase
    .from("cutoutly_avatars")
    .update({
      status: "completed",
      progress_stage: "completed",
      progress_percent: 100,
      last_processed: new Date().toISOString(),
    })
    .eq("id", avatarId)
    .eq("user_id", userId)

  if (error) {
    console.error(`Error finalizing avatar: ${error.message}`)
    throw new Error(`Failed to finalize avatar: ${error.message}`)
  }

  // Try to delete the temporary image
  try {
    if (avatar.input_image_path) {
      await supabase.storage.from("cutoutly").remove([avatar.input_image_path])
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`Warning: Could not delete temporary image: ${errorMsg}`)
    // Non-critical error, continue
  }

  console.log(`✅ Avatar ${avatarId} completed successfully`)

  return NextResponse.json({
    status: "completed",
    progress_stage: "completed",
    progress_percent: 100,
    image_url: publicUrl,
    message: "Avatar completed successfully",
  })
} 