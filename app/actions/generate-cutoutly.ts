"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { createClient } from "@/utils/supabase/server"

export type CutoutlyGenerationData = {
  image?: File
  savedFaceId?: string | null
  pose?: string
  prop?: string
  style?: string
  expression?: string
  speechBubble?: string
  useCase?: string
  size: string
  isCustomMode?: boolean
  customPrompt?: string
}

export async function generateCutoutly(data: CutoutlyGenerationData) {
  try {
    // Check authentication
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "Unauthorized" }
    }

    console.log("🚀 Starting Cutoutly generation process with data:", {
      isCustomMode: data.isCustomMode,
      customPrompt: data.isCustomMode ? data.customPrompt?.substring(0, 50) + "..." : undefined,
      pose: !data.isCustomMode ? data.pose : undefined,
      prop: !data.isCustomMode ? data.prop : undefined,
      style: !data.isCustomMode ? data.style : undefined,
      expression: !data.isCustomMode ? data.expression : undefined,
      speechBubble: !data.isCustomMode ? data.speechBubble : undefined,
      useCase: !data.isCustomMode ? data.useCase : undefined,
      size: data.size,
      savedFaceId: data.savedFaceId,
      imageSize: data.image?.size,
    })

    const supabaseAdmin = createServerSupabaseClient()

    // Create a new cartoon entry in the database
    console.log("📝 Creating new cutoutly entry in database...")

    const insertData = {
      user_id: user.id,
      size: data.size,
      saved_face_id: data.savedFaceId || null,
      status: "processing",
      progress_stage: "initializing",
      progress_percent: 0,
      last_processed: new Date().toISOString(),
      is_custom_mode: data.isCustomMode || false,
    }

    // Add structured fields if not in custom mode
    if (!data.isCustomMode) {
      Object.assign(insertData, {
        pose: data.pose,
        prop: data.prop,
        style: data.style,
        expression: data.expression,
        speech_bubble: data.speechBubble || null,
        use_case: data.useCase || null,
      })
    } else {
      // Add custom prompt if in custom mode
      Object.assign(insertData, {
        custom_prompt: data.customPrompt,
      })
    }

    const { data: cartoonData, error } = await supabaseAdmin
      .from("cutoutly_cartoons")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("❌ Error creating cutoutly entry:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Cutoutly entry created with ID:", cartoonData.id)

    // For custom mode, we don't need to upload an image, so we can skip to the next stage
    if (data.isCustomMode) {
      // Update the cartoon to move to the next stage
      const { error: updateError } = await supabaseAdmin
        .from("cutoutly_cartoons")
        .update({
          progress_stage: "prompt_generated",
          progress_percent: 20,
          prompt: data.customPrompt,
          last_processed: new Date().toISOString(),
        })
        .eq("id", cartoonData.id)

      if (updateError) {
        console.error(`❌ Error updating cutoutly with prompt: ${updateError.message}`)
        throw new Error(`Error updating cutoutly with prompt: ${updateError.message}`)
      }

      console.log(`✅ Custom prompt saved, skipping image upload`)

      // Return the cartoon ID for client-side polling
      return { success: true, cartoonId: cartoonData.id }
    }

    // For structured mode, process the image and store it temporarily
    try {
      if (!data.image) {
        throw new Error("Image is required for structured mode")
      }

      // Convert the image to a format that can be sent to OpenAI
      console.log(`🔄 Processing input image: ${data.image.name}, size: ${data.image.size} bytes`)
      const arrayBuffer = await data.image.arrayBuffer()
      const imageBlob = new Blob([arrayBuffer], { type: data.image.type })

      // Store the image temporarily in Supabase storage
      const fileName = `cutoutly/temp/${cartoonData.id}_input.png`
      console.log(`📤 Uploading temporary image to: ${fileName}`)

      const { error: uploadError } = await supabaseAdmin.storage.from("cutoutly").upload(fileName, imageBlob, {
        contentType: data.image.type,
        upsert: false,
      })

      if (uploadError) {
        console.error(`❌ Error uploading temporary image: ${uploadError.message}`)
        throw new Error(`Error uploading temporary image: ${uploadError.message}`)
      }

      console.log(`✅ Temporary image uploaded successfully`)

      // Update the cartoon with the temporary image path
      const { error: updateError } = await supabaseAdmin
        .from("cutoutly_cartoons")
        .update({
          progress_stage: "image_uploaded",
          progress_percent: 10,
          input_image_path: fileName,
          last_processed: new Date().toISOString(),
        })
        .eq("id", cartoonData.id)

      if (updateError) {
        console.error(`❌ Error updating cutoutly with temp image path: ${updateError.message}`)
        throw new Error(`Error updating cutoutly with temp image path: ${updateError.message}`)
      }

      console.log(`✅ Cutoutly updated with temporary image path`)
    } catch (error: any) {
      console.error("❌ Error processing image:", error)
      await supabaseAdmin
        .from("cutoutly_cartoons")
        .update({
          status: "failed",
          error_message: `Error processing image: ${error.message}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", cartoonData.id)

      return { success: false, error: `Error processing image: ${error.message}` }
    }

    // Return the cartoon ID for client-side polling
    return { success: true, cartoonId: cartoonData.id }
  } catch (error: any) {
    console.error("❌ Error in generateCutoutly:", error)
    return { success: false, error: `Failed to generate cartoon: ${error.message}` }
  }
}
