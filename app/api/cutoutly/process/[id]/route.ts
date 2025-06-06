import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import openaiClient from "@/lib/openai"
import { toFile } from "openai"
import { v4 as uuidv4 } from "uuid"
import { generateCutoutlyPrompt } from "@/lib/cutoutly/prompt-generator"

// Track processing cartoons to prevent multiple simultaneous processing
const processingCartoons = new Set<string>()

// Define params as a Promise
type Props = {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: Props
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
    const { id: cartoonId } = await params

    if (!cartoonId) {
      return NextResponse.json({ error: "Cartoon ID is required" }, { status: 400 })
    }

    // Prevent multiple simultaneous processing of the same cartoon
    if (processingCartoons.has(cartoonId)) {
      return NextResponse.json({
        status: "processing",
        message: "Cartoon is already being processed",
      })
    }

    // Mark this cartoon as being processed
    processingCartoons.add(cartoonId)

    try {
      // Get the cartoon data using the authenticated client
      const { data: cartoon, error } = await supabase
        .from("cutoutly_cartoons")
        .select("*")
        .eq("id", cartoonId)
        .eq("user_id", user.id) // Ensure the cartoon belongs to the authenticated user
        .single()

      if (error || !cartoon) {
        console.error("Error fetching cartoon:", error)
        processingCartoons.delete(cartoonId)
        return NextResponse.json({ error: "Cartoon not found" }, { status: 404 })
      }

      // Check if the cartoon is already completed or failed
      if (cartoon.status === "completed") {
        processingCartoons.delete(cartoonId)
        return NextResponse.json({ status: "completed", image_url: cartoon.output_image_path })
      }

      if (cartoon.status === "failed") {
        processingCartoons.delete(cartoonId)
        return NextResponse.json({ status: "failed", error: cartoon.error_message })
      }

      console.log(`Processing cartoon ${cartoonId}, current stage: ${cartoon.progress_stage}`)

      // Check the current progress stage and continue from there
      let result
      switch (cartoon.progress_stage) {
        case "initializing":
          // For custom mode, we might already have the prompt
          if (cartoon.is_custom_mode && cartoon.custom_prompt) {
            // Use the custom prompt directly
            const { error: updateError } = await supabase
              .from("cutoutly_cartoons")
              .update({
                prompt: `${cartoon.custom_prompt}. Ensure the image has a completely transparent background.`,
                progress_stage: "prompt_generated",
                progress_percent: 20,
                last_processed: new Date().toISOString(),
              })
              .eq("id", cartoonId)
              .eq("user_id", user.id)

            if (updateError) {
              throw new Error(`Failed to update cartoon with custom prompt: ${updateError.message}`)
            }

            result = await processGenerateCartoonWithoutImage(cartoonId, cartoon, supabase, user.id)
          } else {
            // For structured mode, we need to process the image first
            result = await processGeneratePrompt(cartoonId, cartoon, supabase, user.id)
          }
          break

        case "image_uploaded":
          result = await processGeneratePrompt(cartoonId, cartoon, supabase, user.id)
          break

        case "prompt_generated":
          // Check if this is a custom prompt without an image
          if (cartoon.is_custom_mode && !cartoon.input_image_path) {
            result = await processGenerateCartoonWithoutImage(cartoonId, cartoon, supabase, user.id)
          } else {
            result = await processGenerateCartoon(cartoonId, cartoon, supabase, user.id)
          }
          break

        case "cartoon_generated":
          result = await processFinalizeCartoon(cartoonId, cartoon, supabase, user.id)
          break

        default:
          // If we don't recognize the stage, start from the beginning
          result = await processGeneratePrompt(cartoonId, cartoon, supabase, user.id)
          break
      }

      processingCartoons.delete(cartoonId)
      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`Error processing cartoon ${cartoonId}:`, errorMsg)

      // Update the cartoon status to failed using the authenticated client
      await supabase
        .from("cutoutly_cartoons")
        .update({
          status: "failed",
          error_message: `Processing error: ${errorMsg}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", cartoonId)
        .eq("user_id", user.id) // Ensure the cartoon belongs to the authenticated user

      processingCartoons.delete(cartoonId)
      return NextResponse.json(
        {
          status: "failed",
          error: `Processing error: ${errorMsg}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("Error in process API:", errorMsg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Step 1: Generate the prompt
async function processGeneratePrompt(cartoonId: string, cartoon: any, supabase: any, userId: string) {
  console.log(`📝 Generating prompt for cartoon ${cartoonId}...`)

  try {
    // Generate the prompt using our prompt generator
    const prompt = generateCutoutlyPrompt({
      pose: cartoon.pose,
      prop: cartoon.prop,
      style: cartoon.style,
      expression: cartoon.expression,
      speechBubble: cartoon.speech_bubble,
      useCase: cartoon.use_case,
      isCustomMode: cartoon.is_custom_mode,
      customPrompt: cartoon.custom_prompt,
    })

    console.log(`Generated prompt: ${prompt.substring(0, 100)}...`)

    // Update the cartoon with the prompt using the authenticated client
    const { error } = await supabase
      .from("cutoutly_cartoons")
      .update({
        prompt: prompt,
        progress_stage: "prompt_generated",
        progress_percent: 20,
        last_processed: new Date().toISOString(),
      })
      .eq("id", cartoonId)
      .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

    if (error) {
      console.error(`Error updating cartoon after generating prompt: ${error.message}`)
      throw new Error(`Failed to update cartoon after generating prompt: ${error.message}`)
    }

    console.log(`✅ Updated cartoon ${cartoonId} to stage: prompt_generated`)

    return NextResponse.json({
      status: "processing",
      progress_stage: "prompt_generated",
      progress_percent: 20,
      message: "Prompt generated successfully",
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`Error generating prompt: ${errorMsg}`)
    throw new Error(`Failed to generate prompt: ${errorMsg}`)
  }
}

// Generate cartoon without an image (for custom prompts)
async function processGenerateCartoonWithoutImage(cartoonId: string, cartoon: any, supabase: any, userId: string) {
  console.log(`🎨 Generating cartoon from custom prompt for ${cartoonId}...`)

  // Update progress before API call using the authenticated client
  const { error: updateError } = await supabase
    .from("cutoutly_cartoons")
    .update({
      progress_stage: "calling_openai",
      progress_percent: 40,
      last_processed: new Date().toISOString(),
    })
    .eq("id", cartoonId)
    .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

  if (updateError) {
    console.error(`Error updating cartoon before OpenAI call: ${updateError.message}`)
    throw new Error(`Failed to update cartoon before OpenAI call: ${updateError.message}`)
  }

  console.log(`✅ Updated cartoon ${cartoonId} to stage: calling_openai`)

  // Call OpenAI API
  console.log(`🚀 Calling OpenAI API with model: gpt-image-1, quality: medium, size: ${cartoon.size}...`)

  const startApiCall = Date.now()
  try {
    // Make the API call for text-to-image generation
    const response = await openaiClient.images.generate({
      model: "gpt-image-1",
      prompt: cartoon.prompt,
      n: 1,
      size: cartoon.size as "1024x1024" | "1536x1024" | "1024x1536" | "auto",
      quality: "low",
      background: "transparent", // Add this parameter to ensure transparency
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
    const fileName = `cutoutly/generated/${userId}/${cartoonId}_${uuidv4()}.png`

    const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, generatedImageBlob, {
      contentType: "image/png",
      upsert: false,
    })

    if (uploadError) {
      console.error(`Error uploading generated image: ${uploadError.message}`)
      throw new Error(`Error uploading generated image: ${uploadError.message}`)
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("cutoutly").getPublicUrl(fileName)

    // Update the cartoon with the URL using the authenticated client
    const { error } = await supabase
      .from("cutoutly_cartoons")
      .update({
        output_image_path: fileName,
        progress_stage: "cartoon_generated",
        progress_percent: 80,
        last_processed: new Date().toISOString(),
      })
      .eq("id", cartoonId)
      .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

    if (error) {
      console.error(`Error updating cartoon after OpenAI call: ${error.message}`)
      throw new Error(`Failed to update cartoon after OpenAI call: ${error.message}`)
    }

    console.log(`✅ Updated cartoon ${cartoonId} to stage: cartoon_generated`)

    return NextResponse.json({
      status: "processing",
      progress_stage: "cartoon_generated",
      progress_percent: 80,
      message: "Cartoon generated successfully",
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
}

// Step 2: Generate the cartoon using OpenAI with an image
async function processGenerateCartoon(cartoonId: string, cartoon: any, supabase: any, userId: string) {
  console.log(`🎨 Generating cartoon for ${cartoonId}...`)

  // Download the input image using the authenticated client
  const { data: imageData, error: downloadError } = await supabase.storage
    .from("cutoutly")
    .download(cartoon.input_image_path)

  if (downloadError) {
    console.error(`Error downloading image: ${downloadError.message}`)
    throw new Error(`Error downloading image: ${downloadError.message}`)
  }

  // Update progress before API call using the authenticated client
  const { error: updateError } = await supabase
    .from("cutoutly_cartoons")
    .update({
      progress_stage: "calling_openai",
      progress_percent: 40,
      last_processed: new Date().toISOString(),
    })
    .eq("id", cartoonId)
    .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

  if (updateError) {
    console.error(`Error updating cartoon before OpenAI call: ${updateError.message}`)
    throw new Error(`Failed to update cartoon before OpenAI call: ${updateError.message}`)
  }

  console.log(`✅ Updated cartoon ${cartoonId} to stage: calling_openai`)

  // Convert to blob
  const imageBlob = new Blob([imageData], { type: "image/png" })
  console.log(`Created image blob: size=${imageBlob.size} bytes, type=${imageBlob.type}`)

  // Verify the blob is valid
  if (imageBlob.size === 0) {
    throw new Error("Image blob is empty")
  }

  // Call OpenAI API
  console.log(`🚀 Calling OpenAI API with model: gpt-image-1, quality: medium, size: ${cartoon.size}...`)

  const startApiCall = Date.now()
  try {
    // Convert the blob to a File object using toFile
    const imageFile = await toFile(imageBlob, "image.png", { type: "image/png" })
    console.log(`Converted blob to File object: name=${imageFile.name}, size=${imageFile.size} bytes`)

    // Make the API call with the image as an array of File objects
    const response = await openaiClient.images.edit({
      model: "gpt-image-1",
      image: [imageFile], // Pass as an array of File objects
      prompt: cartoon.prompt,
      n: 1,
      size: cartoon.size as "1024x1024" | "1536x1024" | "1024x1536" | "auto",
      quality: "medium",
      background: "transparent", // This is the key parameter for transparent backgrounds
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
    const fileName = `cutoutly/generated/${userId}/${cartoonId}_${uuidv4()}.png`

    const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, generatedImageBlob, {
      contentType: "image/png",
      upsert: false,
    })

    if (uploadError) {
      console.error(`Error uploading generated image: ${uploadError.message}`)
      throw new Error(`Error uploading generated image: ${uploadError.message}`)
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("cutoutly").getPublicUrl(fileName)

    // Update the cartoon with the URL using the authenticated client
    const { error } = await supabase
      .from("cutoutly_cartoons")
      .update({
        output_image_path: fileName,
        progress_stage: "cartoon_generated",
        progress_percent: 80,
        last_processed: new Date().toISOString(),
      })
      .eq("id", cartoonId)
      .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

    if (error) {
      console.error(`Error updating cartoon after OpenAI call: ${error.message}`)
      throw new Error(`Failed to update cartoon after OpenAI call: ${error.message}`)
    }

    console.log(`✅ Updated cartoon ${cartoonId} to stage: cartoon_generated`)

    return NextResponse.json({
      status: "processing",
      progress_stage: "cartoon_generated",
      progress_percent: 80,
      message: "Cartoon generated successfully",
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
}

// Step 3: Finalize the cartoon
async function processFinalizeCartoon(cartoonId: string, cartoon: any, supabase: any, userId: string) {
  console.log(`✅ Finalizing cartoon ${cartoonId}...`)

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("cutoutly").getPublicUrl(cartoon.output_image_path)

  // Update the cartoon status to completed using the authenticated client
  const { error } = await supabase
    .from("cutoutly_cartoons")
    .update({
      status: "completed",
      progress_stage: "completed",
      progress_percent: 100,
      last_processed: new Date().toISOString(),
    })
    .eq("id", cartoonId)
    .eq("user_id", userId) // Ensure the cartoon belongs to the authenticated user

  if (error) {
    console.error(`Error finalizing cartoon: ${error.message}`)
    throw new Error(`Failed to finalize cartoon: ${error.message}`)
  }

  // Try to delete the temporary image
  try {
    if (cartoon.input_image_path) {
      await supabase.storage.from("cutoutly").remove([cartoon.input_image_path])
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`Warning: Could not delete temporary image: ${errorMsg}`)
    // Non-critical error, continue
  }

  console.log(`✅ Cartoon ${cartoonId} completed successfully`)

  return NextResponse.json({
    status: "completed",
    progress_stage: "completed",
    progress_percent: 100,
    image_url: publicUrl,
    message: "Cartoon completed successfully",
  })
}
