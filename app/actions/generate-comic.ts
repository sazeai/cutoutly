"use server"

import { createServerSupabaseClient } from "@/lib/supabase"

export type ComicGenerationData = {
  image: File
  mood: string
  persona: string
  vibe?: string
  style: string
  layout: string
  size: string
}

export async function generateComic(data: ComicGenerationData) {
  try {
    console.log("🚀 Starting comic generation process with data:", {
      mood: data.mood,
      persona: data.persona,
      vibe: data.vibe,
      style: data.style,
      layout: data.layout,
      size: data.size,
      imageSize: data.image.size,
    })

    const supabase = createServerSupabaseClient()

    // Create a new comic entry in the database
    console.log("📝 Creating new comic entry in database...")
    const { data: comicData, error } = await supabase
      .from("comics")
      .insert({
        mood: data.mood,
        persona: data.persona,
        vibe: data.vibe || null,
        style: data.style,
        layout: data.layout,
        size: data.size,
        status: "processing",
        progress_stage: "initializing",
        progress_percent: 0,
        last_processed: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Error creating comic entry:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Comic entry created with ID:", comicData.id)

    // Process the image and store it temporarily
    try {
      // Convert the image to a format that can be sent to OpenAI
      console.log(`🔄 Processing input image: ${data.image.name}, size: ${data.image.size} bytes`)
      const arrayBuffer = await data.image.arrayBuffer()
      const imageBlob = new Blob([arrayBuffer], { type: data.image.type })

      // Store the image temporarily in Supabase storage
      const fileName = `temp/${comicData.id}_input.png`
      console.log(`📤 Uploading temporary image to: ${fileName}`)

      const { error: uploadError } = await supabase.storage.from("comic-vibe-images").upload(fileName, imageBlob, {
        contentType: data.image.type,
        upsert: false,
      })

      if (uploadError) {
        console.error(`❌ Error uploading temporary image: ${uploadError.message}`)
        throw new Error(`Error uploading temporary image: ${uploadError.message}`)
      }

      console.log(`✅ Temporary image uploaded successfully`)

      // Update the comic with the temporary image path
      const { error: updateError } = await supabase
        .from("comics")
        .update({
          progress_stage: "image_uploaded",
          progress_percent: 10,
          temp_image_path: fileName,
          last_processed: new Date().toISOString(),
        })
        .eq("id", comicData.id)

      if (updateError) {
        console.error(`❌ Error updating comic with temp image path: ${updateError.message}`)
        throw new Error(`Error updating comic with temp image path: ${updateError.message}`)
      }

      console.log(`✅ Comic updated with temporary image path`)
    } catch (error: any) {
      console.error("❌ Error processing image:", error)
      await supabase
        .from("comics")
        .update({
          status: "failed",
          error_message: `Error processing image: ${error.message}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", comicData.id)

      return { success: false, error: `Error processing image: ${error.message}` }
    }

    // Return the comic ID for client-side polling
    return { success: true, comicId: comicData.id }
  } catch (error: any) {
    console.error("❌ Error in generateComic:", error)
    return { success: false, error: `Failed to generate comic: ${error.message}` }
  }
}
