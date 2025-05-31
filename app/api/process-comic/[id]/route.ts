import { createServerSupabaseClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import openaiClient from "@/lib/openai" // Import our initialized client
import { toFile } from "openai" // Import toFile separately
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"
import { generateComicScript } from "@/lib/gpt4o"

// Track processing comics to prevent multiple simultaneous processing
const processingComics = new Set<string>()

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const comicId = params.id

    if (!comicId) {
      return NextResponse.json({ error: "Comic ID is required" }, { status: 400 })
    }

    // Prevent multiple simultaneous processing of the same comic
    if (processingComics.has(comicId)) {
      return NextResponse.json({
        status: "processing",
        message: "Comic is already being processed",
      })
    }

    // Mark this comic as being processed
    processingComics.add(comicId)

    try {
      const supabase = createServerSupabaseClient()

      // Get the comic data
      const { data: comic, error } = await supabase.from("comics").select("*").eq("id", comicId).single()

      if (error || !comic) {
        console.error("Error fetching comic:", error)
        processingComics.delete(comicId)
        return NextResponse.json({ error: "Comic not found" }, { status: 404 })
      }

      // Check if the comic is already completed or failed
      if (comic.status === "completed") {
        processingComics.delete(comicId)
        return NextResponse.json({ status: "completed", comic_url: comic.comic_url })
      }

      if (comic.status === "failed") {
        processingComics.delete(comicId)
        return NextResponse.json({ status: "failed", error: comic.error_message })
      }

      console.log(`Processing comic ${comicId}, current stage: ${comic.progress_stage}`)

      // Check the current progress stage and continue from there
      let result
      switch (comic.progress_stage) {
        case "initializing":
        case "image_uploaded":
        case "processing_started":
          result = await processGeneratePrompt(comicId, comic, supabase)
          break

        case "prompt_generated":
          result = await processDownloadImage(comicId, comic, supabase)
          break

        case "image_downloaded":
          result = await processGenerateComic(comicId, comic, supabase)
          break

        case "comic_generated":
          result = await processUploadResult(comicId, comic, supabase)
          break

        case "result_uploaded":
          result = await processFinalizeComic(comicId, comic, supabase)
          break

        default:
          // If we don't recognize the stage, start from the beginning
          result = await processGeneratePrompt(comicId, comic, supabase)
          break
      }

      processingComics.delete(comicId)
      return result
    } catch (error) {
      console.error(`Error processing comic ${comicId}:`, error)

      // Update the comic status to failed
      const supabase = createServerSupabaseClient()
      await supabase
        .from("comics")
        .update({
          status: "failed",
          error_message: `Processing error: ${error.message}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", comicId)

      processingComics.delete(comicId)
      return NextResponse.json(
        {
          status: "failed",
          error: `Processing error: ${error.message}`,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in process-comic API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Step 1: Generate the prompt using GPT-4o-mini
async function processGeneratePrompt(comicId: string, comic: any, supabase: any) {
  console.log(`📝 Generating comic script for comic ${comicId} using GPT-4o-mini...`)

  try {
    // Determine panel count based on layout
    let panelCount = 3 // Default
    if (comic.layout === "horizontal" || comic.layout === "vertical") {
      panelCount = 3
    } else if (comic.layout === "carousel") {
      panelCount = 4
    }

    // Generate the comic script using GPT-4o-mini
    const script = await generateComicScript({
      persona: comic.persona,
      mood: comic.mood,
      vibe: comic.vibe,
      style: comic.style,
      layout: comic.layout,
      panelCount,
    })

    console.log(`Generated comic script:`)
    console.log(`Title: ${script.title}`)
    console.log(`Panels: ${script.panels.join(" | ")}`)
    console.log(`Final prompt: ${script.final_prompt.substring(0, 100)}...`)

    // Update the comic with the script and prompt
    const { error } = await supabase
      .from("comics")
      .update({
        title: script.title,
        panel_descriptions: script.panels,
        prompt: script.final_prompt,
        progress_stage: "prompt_generated",
        progress_percent: 20,
        last_processed: new Date().toISOString(),
      })
      .eq("id", comicId)

    if (error) {
      console.error(`Error updating comic after generating prompt: ${error.message}`)
      throw new Error(`Failed to update comic after generating prompt: ${error.message}`)
    }

    console.log(`✅ Updated comic ${comicId} to stage: prompt_generated`)

    return NextResponse.json({
      status: "processing",
      progress_stage: "prompt_generated",
      progress_percent: 20,
      message: "Comic script generated successfully",
    })
  } catch (error) {
    console.error(`Error generating comic script: ${error.message}`)
    throw new Error(`Failed to generate comic script: ${error.message}`)
  }
}

// Step 2: Download the temporary image
async function processDownloadImage(comicId: string, comic: any, supabase: any) {
  console.log(`📥 Downloading image for comic ${comicId}...`)

  // Check if we have a temporary image path
  if (!comic.temp_image_path) {
    console.error(`No temporary image path found for comic ${comicId}`)
    throw new Error("No temporary image path found")
  }

  // Download the temporary image
  const { data: imageData, error: downloadError } = await supabase.storage
    .from("comic-vibe-images")
    .download(comic.temp_image_path)

  if (downloadError) {
    console.error(`Error downloading image: ${downloadError.message}`)
    throw new Error(`Error downloading image: ${downloadError.message}`)
  }

  // Log image data details to debug
  console.log(`Downloaded image data type: ${typeof imageData}`)
  console.log(`Downloaded image data size: ${imageData.size} bytes`)
  console.log(`Downloaded image data is ArrayBuffer: ${imageData instanceof ArrayBuffer}`)

  // Update the comic progress
  const { error } = await supabase
    .from("comics")
    .update({
      progress_stage: "image_downloaded",
      progress_percent: 30,
      last_processed: new Date().toISOString(),
    })
    .eq("id", comicId)

  if (error) {
    console.error(`Error updating comic after downloading image: ${error.message}`)
    throw new Error(`Failed to update comic after downloading image: ${error.message}`)
  }

  console.log(`✅ Updated comic ${comicId} to stage: image_downloaded`)

  return NextResponse.json({
    status: "processing",
    progress_stage: "image_downloaded",
    progress_percent: 30,
    message: "Image downloaded successfully",
  })
}

// Step 3: Generate the comic using OpenAI
async function processGenerateComic(comicId: string, comic: any, supabase: any) {
  console.log(`🎨 Generating comic for ${comicId}...`)

  // Download the temporary image again (in case this is a separate request)
  const { data: imageData, error: downloadError } = await supabase.storage
    .from("comic-vibe-images")
    .download(comic.temp_image_path)

  if (downloadError) {
    console.error(`Error downloading image: ${downloadError.message}`)
    throw new Error(`Error downloading image: ${downloadError.message}`)
  }

  // Log image data details to debug
  console.log(`Downloaded image data type: ${typeof imageData}`)
  console.log(`Downloaded image data size: ${imageData.size} bytes`)
  console.log(`Downloaded image data is ArrayBuffer: ${imageData instanceof ArrayBuffer}`)

  // Update progress before API call
  const { error: updateError } = await supabase
    .from("comics")
    .update({
      progress_stage: "calling_openai",
      progress_percent: 40,
      last_processed: new Date().toISOString(),
    })
    .eq("id", comicId)

  if (updateError) {
    console.error(`Error updating comic before OpenAI call: ${updateError.message}`)
    throw new Error(`Failed to update comic before OpenAI call: ${updateError.message}`)
  }

  console.log(`✅ Updated comic ${comicId} to stage: calling_openai`)

  // Convert to blob
  const imageBlob = new Blob([imageData], { type: "image/png" })
  console.log(`Created image blob: size=${imageBlob.size} bytes, type=${imageBlob.type}`)

  // Verify the blob is valid
  if (imageBlob.size === 0) {
    throw new Error("Image blob is empty")
  }

  // Call OpenAI API
  console.log(`🚀 Calling OpenAI API with model: gpt-image-1, quality: low, size: ${comic.size}...`)

  const startApiCall = Date.now()
  try {
    // Convert the blob to a File object using toFile
    const imageFile = await toFile(imageBlob, "image.png", { type: "image/png" })
    console.log(`Converted blob to File object: name=${imageFile.name}, size=${imageFile.size} bytes`)

    // Make the API call with the image as an array of File objects
    const response = await openaiClient.images.edit({
      model: "gpt-image-1",
      image: [imageFile], // Pass as an array of File objects
      prompt: comic.prompt,
      n: 1,
      size: comic.size as "1024x1024" | "1536x1024" | "1024x1536" | "auto",
      quality: "medium",
    })

    console.log(`✅ OpenAI API call completed in ${Date.now() - startApiCall}ms`)
    console.log(`Response structure:`, Object.keys(response))
    console.log(`Response data length:`, response.data.length)

    // Get the base64 image data
    const imageBase64 = response.data[0].b64_json

    if (!imageBase64) {
      throw new Error("No image data returned from OpenAI")
    }

    console.log(`Received base64 data of length: ${imageBase64.length} characters`)

    // Store the base64 data temporarily
    const { error } = await supabase
      .from("comics")
      .update({
        temp_result_base64: imageBase64,
        progress_stage: "comic_generated",
        progress_percent: 70,
        last_processed: new Date().toISOString(),
      })
      .eq("id", comicId)

    if (error) {
      console.error(`Error updating comic after OpenAI call: ${error.message}`)
      throw new Error(`Failed to update comic after OpenAI call: ${error.message}`)
    }

    console.log(`✅ Updated comic ${comicId} to stage: comic_generated`)

    return NextResponse.json({
      status: "processing",
      progress_stage: "comic_generated",
      progress_percent: 70,
      message: "Comic generated successfully",
    })
  } catch (error: any) {
    console.error(`OpenAI API error:`, error)

    // Log detailed error information
    if (error.response) {
      console.error(`OpenAI API response status: ${error.response.status}`)
      console.error(`OpenAI API response data:`, error.response.data)
    }

    // Check if it's a timeout error
    if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT") || error.code === "ETIMEDOUT") {
      // Mark as failed due to timeout
      await supabase
        .from("comics")
        .update({
          status: "failed",
          error_message: "OpenAI API request timed out. Please try again.",
          last_processed: new Date().toISOString(),
        })
        .eq("id", comicId)

      throw new Error("OpenAI API request timed out. Please try again.")
    }

    throw error
  }
}

// Step 4: Upload the result to storage
async function processUploadResult(comicId: string, comic: any, supabase: any) {
  console.log(`📤 Uploading result for comic ${comicId}...`)

  if (!comic.temp_result_base64) {
    console.error(`No base64 result found for comic ${comicId}`)
    throw new Error("No base64 result found")
  }

  // Convert base64 to Buffer
  const imageBuffer = Buffer.from(comic.temp_result_base64, "base64")
  const generatedImageBlob = new Blob([imageBuffer], { type: "image/png" })

  // Upload the generated image to Supabase
  const fileName = `generated/${comicId}_comic_${uuidv4()}.png`

  const { error: uploadError } = await supabase.storage.from("comic-vibe-images").upload(fileName, generatedImageBlob, {
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
  } = supabase.storage.from("comic-vibe-images").getPublicUrl(fileName)

  // Update the comic with the URL
  const { error } = await supabase
    .from("comics")
    .update({
      comic_url: publicUrl,
      progress_stage: "result_uploaded",
      progress_percent: 90,
      last_processed: new Date().toISOString(),
    })
    .eq("id", comicId)

  if (error) {
    console.error(`Error updating comic after uploading result: ${error.message}`)
    throw new Error(`Failed to update comic after uploading result: ${error.message}`)
  }

  console.log(`✅ Updated comic ${comicId} to stage: result_uploaded`)

  return NextResponse.json({
    status: "processing",
    progress_stage: "result_uploaded",
    progress_percent: 90,
    message: "Result uploaded successfully",
  })
}

// Step 5: Finalize the comic
async function processFinalizeComic(comicId: string, comic: any, supabase: any) {
  console.log(`✅ Finalizing comic ${comicId}...`)

  // Clean up temporary data
  const { error } = await supabase
    .from("comics")
    .update({
      status: "completed",
      progress_stage: "completed",
      progress_percent: 100,
      temp_result_base64: null, // Clear the temporary base64 data
      last_processed: new Date().toISOString(),
    })
    .eq("id", comicId)

  if (error) {
    console.error(`Error finalizing comic: ${error.message}`)
    throw new Error(`Failed to finalize comic: ${error.message}`)
  }

  // Try to delete the temporary image
  try {
    if (comic.temp_image_path) {
      await supabase.storage.from("comic-vibe-images").remove([comic.temp_image_path])
    }
  } catch (error) {
    console.error(`Warning: Could not delete temporary image: ${error.message}`)
    // Non-critical error, continue
  }

  // Revalidate the result page
  revalidatePath(`/result/${comicId}`)

  console.log(`✅ Comic ${comicId} completed successfully`)

  return NextResponse.json({
    status: "completed",
    progress_stage: "completed",
    progress_percent: 100,
    comic_url: comic.comic_url,
    message: "Comic completed successfully",
  })
}
