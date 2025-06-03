import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import openaiClient from "@/lib/openai"
import { toFile } from "openai"
import { v4 as uuidv4 } from "uuid"

// Track processing avatars to prevent multiple simultaneous processing
const processingAvatars = new Set<string>()

export async function POST(request: NextRequest, context: { params: { id: string } }) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params from context
    const { params } = context
    const avatarId = params?.id

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
      // Get the avatar data
      const { data: avatar, error } = await supabase
        .from("cutoutly_avatars")
        .select("*")
        .eq("id", avatarId)
        .eq("user_id", user.id)
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

      // Generate the prompt based on the avatar settings
      const prompt = generateAvatarPrompt({
        style: avatar.style,
        expression: avatar.expression,
        outfitTheme: avatar.outfit_theme,
      })

      // Update the avatar with the prompt
      const { error: updateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          prompt: prompt,
          progress_stage: "prompt_generated",
          progress_percent: 40,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", user.id)

      if (updateError) {
        throw new Error(`Failed to update avatar with prompt: ${updateError.message}`)
      }

      // Download the input image
      const { data: imageData, error: downloadError } = await supabase.storage
        .from("cutoutly")
        .download(avatar.input_image_path)

      if (downloadError) {
        throw new Error(`Error downloading image: ${downloadError.message}`)
      }

      // Convert to blob
      const imageBlob = new Blob([imageData], { type: "image/png" })
      const imageFile = await toFile(imageBlob, "image.png", { type: "image/png" })

      // Call OpenAI API
      const response = await openaiClient.images.edit({
        model: "gpt-image-1",
        image: [imageFile],
        prompt: prompt,
        n: 1,
        size: (avatar.size as "1024x1024" | "1536x1024" | "1024x1536" | "auto"),
        quality: "low",
      })

      // Get the base64 image data
      if (!response.data?.[0]?.b64_json) {
        throw new Error("No image data returned from OpenAI")
      }
      const imageBase64 = response.data[0].b64_json

      // Convert base64 to Buffer
      const imageBuffer = Buffer.from(imageBase64, "base64")
      const generatedImageBlob = new Blob([imageBuffer], { type: "image/png" })

      // Upload the generated image
      const fileName = `cutoutly/generated/${user.id}/${avatarId}_${uuidv4()}.png`
      const { error: uploadError } = await supabase.storage.from("cutoutly").upload(fileName, generatedImageBlob, {
        contentType: "image/png",
        upsert: false,
      })

      if (uploadError) {
        throw new Error(`Error uploading generated image: ${uploadError.message}`)
      }

      // Update the avatar with the output image path
      const { error: finalUpdateError } = await supabase
        .from("cutoutly_avatars")
        .update({
          output_image_path: fileName,
          status: "completed",
          progress_stage: "completed",
          progress_percent: 100,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", user.id)

      if (finalUpdateError) {
        throw new Error(`Failed to update avatar after generation: ${finalUpdateError.message}`)
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cutoutly").getPublicUrl(fileName)

      processingAvatars.delete(avatarId)
      return NextResponse.json({
        status: "completed",
        image_url: publicUrl,
        message: "Avatar generated successfully",
      })
    } catch (error: any) {
      console.error(`Error processing avatar ${avatarId}:`, error)

      // Update the avatar status to failed
      await supabase
        .from("cutoutly_avatars")
        .update({
          status: "failed",
          error_message: `Processing error: ${error?.message || "Unknown error"}`,
          last_processed: new Date().toISOString(),
        })
        .eq("id", avatarId)
        .eq("user_id", user.id)

      processingAvatars.delete(avatarId)
      return NextResponse.json(
        {
          status: "failed",
          error: `Processing error: ${error?.message || "Unknown error"}`,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    console.error("Error in process-avatar API:", error)
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 })
  }
}

function generateAvatarPrompt({
  style,
  expression,
  outfitTheme,
}: {
  style: string
  expression: string
  outfitTheme: string
}) {
  const stylePrompts = {
    "3d_cartoon": "3D cartoon style with soft shadows, Pixar-style face features, and slight exaggeration, modern and playful",
    "ghibli": "Studio Ghibli inspired art style with wholesome vibes, hand-drawn charm, and light watercolor textures",
    "comic": "comic book style with bold outlines, halftone dots, and dynamic contrast, perfect for storytelling",
    "line_art": "minimalist black and white line sketch style, clean and professional with artistic flair",
    "anime": "anime portrait style with large expressive eyes, smooth shading, and crisp line work",
    "pixel": "retro pixel art style in 8-bit or 16-bit resolution, nostalgic gaming aesthetic",
    "watercolor": "soft watercolor painting style with textured paper feel and artistic brush strokes",
    "cyberpunk": "futuristic cyberpunk style with neon accents, moody lighting, and sci-fi elements",
    "retro_pop": "retro pop art style with bold colors, vintage textures, and Warhol-inspired aesthetic",
    "paper_cutout": "layered paper cutout style with flat shadows and playful paper texture",
    "vector": "minimal vector flat style with solid colors, geometric shapes, and clean design",
    "fantasy": "fantasy illustration style with elven features, magical lighting, and fantasy elements",
    "realistic": "photorealistic style with natural lighting, detailed features, and professional quality",
    "cartoon": "classic cartoon style with bold colors, expressive features, and timeless appeal",
    "disney": "classic Disney animation style with magical charm and iconic character design",
    "pixar": "modern Pixar 3D animation style with detailed textures and expressive features",
    "vector_line_art": "a circular digital avatar illustration with bold black line art, smooth warm gradient background, clear facial features like thick eyebrows and wavy hair, minimal clothing with subtle sketch lines",
    "cute_vector": "a soft, minimalist cartoon avatar with round facial features, clean lines, flat colors with no texture or shading, plain soft light beige background, slightly sideways facing, simple black shirt, cute pink shadows below the eyes",
  }

  const expressionPrompts = {
    happy: "warm, cheerful smile with bright, sparkling eyes",
    cool: "confident, relaxed expression with a slight smirk",
    professional: "polite, composed smile suitable for professional settings",
    friendly: "approachable, welcoming expression with a gentle smile",
    playful: "fun, mischievous look with a playful smile",
    thoughtful: "contemplative expression with a gentle, knowing smile",
    energetic: "dynamic, enthusiastic expression with bright eyes",
    calm: "peaceful, serene expression with a soft smile",
    mysterious: "intriguing, enigmatic expression with a subtle smile",
    determined: "strong, focused expression with confident eyes",
  }

  const outfitPrompts = {
    none: "no specific outfit, focus on facial features and expression",
    casual: "casual everyday clothing like a t-shirt or sweater",
    formal: "professional attire like a suit or formal dress",
    sporty: "athletic wear like a jersey or sports uniform",
    fantasy: "fantasy-themed clothing with magical elements",
    futuristic: "futuristic clothing with high-tech elements",
  }

  const stylePrompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.cartoon
  const expressionPrompt = expressionPrompts[expression as keyof typeof expressionPrompts] || expressionPrompts.happy
  const outfitPrompt = outfitPrompts[outfitTheme as keyof typeof outfitPrompts] || outfitPrompts.casual

  return `Create a profile picture with the following characteristics:
- Style: ${stylePrompt}
- Expression: ${expressionPrompt}
- Outfit: ${outfitPrompt}
- Ensure the image has a completely transparent background.
- The avatar should be centered and well-lit.
- Focus on creating a unique and personalized look that matches the style and expression.`
} 