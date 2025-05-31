export interface CutoutlyParams {
  pose?: string
  prop?: string
  style?: string
  expression?: string
  speechBubble?: string
  useCase?: string
  isCustomMode?: boolean
  customPrompt?: string
}

export function generateCutoutlyPrompt(params: CutoutlyParams): string {
  // If it's custom mode, use the custom prompt with some enhancements
  if (params.isCustomMode && params.customPrompt) {
    return `${params.customPrompt.trim()}. Ensure the character or subject has clean edges and a completely transparent background with no background elements at all. Make the image visually appealing and professional quality with transparency.`
  }

  // Otherwise, use the structured prompt generation
  const { pose, prop, style, expression, speechBubble, useCase } = params

  // Base prompt components
  let prompt = "Create a professional cartoon character with a transparent background. "

  // Add style information
  const styleDescriptions: Record<string, string> = {
    cute: "Use a cute, bubble-style cartoon aesthetic with rounded features and bright colors. ",
    ghibli: "Use a Studio Ghibli inspired art style with soft colors and detailed features. ",
    techy: "Use a clean, modern tech aesthetic with sharp lines and a professional look. ",
    handdrawn: "Use a hand-drawn illustration style with visible sketch lines and an organic feel. ",
    cyberpunk: "Use a cyberpunk aesthetic with neon colors, futuristic elements, and high contrast. ",
    sketch: "Use a sketch-style illustration with pencil-like lines and minimal color. ",
  }

  prompt += styleDescriptions[style || "cute"] || "Use a professional cartoon style. "

  // Add pose information
  const poseDescriptions: Record<string, string> = {
    pointing: "The character should be pointing forward toward the viewer with a confident gesture. ",
    waving: "The character should be waving with a friendly, welcoming gesture. ",
    desk: "The character should be sitting at a desk in a work environment. ",
    phone: "The character should be holding a smartphone, looking at the screen. ",
    talking: "The character should have a talking gesture with one hand raised. ",
    celebration: "The character should be in a celebratory pose with arms raised in excitement. ",
  }

  prompt += poseDescriptions[pose || "pointing"] || ""

  // Add expression information
  const expressionDescriptions: Record<string, string> = {
    happy: "The character should have a happy, smiling expression. ",
    excited: "The character should have an excited, enthusiastic expression. ",
    confident: "The character should have a confident, assured expression. ",
    curious: "The character should have a curious, inquisitive expression. ",
    chill: "The character should have a relaxed, chill expression. ",
    cracked: "The character should have an amazed, mind-blown expression. ",
    burnout: "The character should have a tired, burnt-out expression. ",
  }

  prompt += expressionDescriptions[expression || "happy"] || ""

  // Add prop information if not "none"
  if (prop && prop !== "none") {
    const propDescriptions: Record<string, string> = {
      laptop: "The character should be holding or using a laptop computer. ",
      product: "The character should be holding a product box or package. ",
      slide: "The character should be standing next to or pointing at a presentation slide. ",
      mic: "The character should be holding a microphone as if presenting or podcasting. ",
      scroll: "The character should be holding a scroll or newsletter. ",
    }

    prompt += propDescriptions[prop] || ""
  }

  // Add speech bubble if provided
  if (speechBubble && speechBubble.trim()) {
    prompt += `Include a speech bubble with the text: "${speechBubble.trim()}". `
  }

  // Add use case specific instructions
  if (useCase && useCase !== "none") {
    const useCaseDescriptions: Record<string, string> = {
      website: "Optimize for a website hero section with space around the character. ",
      pitch: "Optimize for a pitch deck slide with a professional appearance. ",
      producthunt: "Optimize for a Product Hunt launch with an enthusiastic appearance. ",
      course: "Optimize for a course thumbnail with a teaching appearance. ",
      twitter: "Optimize for a Twitter/X post with an engaging appearance. ",
      newsletter: "Optimize for a newsletter callout with a friendly appearance. ",
      ad: "Optimize for an ad campaign with an attention-grabbing appearance. ",
    }

    prompt += useCaseDescriptions[useCase] || ""
  }

  // Add final instructions for quality and transparency
  prompt +=
    "Ensure the character has clean edges and a completely transparent background with no background elements at all. Make the cartoon visually appealing and professional quality, suitable for marketing materials."

  return prompt
}
