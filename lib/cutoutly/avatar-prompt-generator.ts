interface AvatarPromptOptions {
  style: string
  expression: string
  outfitTheme: string
  useCase?: string
}

export function generateAvatarPrompt({
  style,
  expression,
  outfitTheme,
  useCase = "profile",
}: AvatarPromptOptions): string {
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
    none: "no specific outfit, use best suitable outfits. focus on facial features and expression",
    casual: "casual everyday clothing like a t-shirt or sweater",
    formal: "professional attire like a suit or formal dress,consider the appropriate gender by identifying in uploaded image",
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
- Use a perfeect background which suits the image and social media profile picture use case.
- The avatar should be centered and well-lit.
- Focus on creating a personalized look that matches the style and expression.`
} 