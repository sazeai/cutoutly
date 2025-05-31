import OpenAI from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export type ComicScriptInput = {
  persona: string
  mood: string
  vibe?: string
  style: string
  layout: string
  panelCount: number
}

export type ComicPanel = {
  description: string
  caption: string
}

export type ComicScript = {
  title: string
  panels: ComicPanel[]
  final_prompt: string
}

export async function generateComicScript(input: ComicScriptInput): Promise<ComicScript> {
  const { persona, mood, vibe, style, layout, panelCount } = input

  const systemPrompt = `You are a professional comic strip writer who specializes in creating relatable, funny, and insightful comic strips about work and life situations. 
  Your task is to create a comic strip script based on the given persona, mood, and other parameters.
  
  Your output must be valid JSON with the following structure:
  {
    "title": "Catchy title for the comic",
    "panels": [
      {
        "description": "Clear, short visual description (1-2 sentences max)",
        "caption": "Speech bubble or caption text (4-5 words max)"
      },
      ...more panels...
    ],
    "final_prompt": "Detailed prompt for image generation"
  }
  
  IMPORTANT GUIDELINES:
  1. Each panel must have two things:
     - A clear, short visual description (max 1-2 sentences)
     - The caption or dialogue (max 4-5 words) that should appear inside the panel
  2. Keep visuals simple and focused - describe only what needs to be seen
  3. Avoid long monologues or complex dialogue
  4. Focus on facial expressions, body language, and simple settings
  5. The final_prompt should combine all panel descriptions with their captions
  
  Make the comic relatable, with a clear story arc, and include humor where appropriate.
  Do not include any explanations or notes outside the JSON structure.`

  const userPrompt = `Create a ${panelCount}-panel comic strip about a ${persona} feeling "${mood}"${
    vibe ? ` with the vibe "${vibe}"` : ""
  } in ${style} style with a ${layout} layout.
  
  Make it specific, relatable, and with a clear story arc. Include humor that resonates with ${persona}s.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No content returned from GPT-4o-mini")
    }

    try {
      const script = JSON.parse(content) as ComicScript

      // Generate the final prompt that includes both descriptions and captions
      if (!script.final_prompt) {
        script.final_prompt = generateFinalPrompt(script, input)
      }

      return script
    } catch (error) {
      console.error("Error parsing JSON from GPT-4o-mini:", error)
      console.error("Raw content:", content)
      throw new Error("Failed to parse comic script from GPT-4o-mini")
    }
  } catch (error) {
    console.error("Error calling GPT-4o-mini:", error)
    throw error
  }
}

// Helper function to generate the final prompt if not provided by GPT-4o-mini
function generateFinalPrompt(script: ComicScript, input: ComicScriptInput): string {
  const { persona, mood, style, layout } = input

  let prompt = `Create a ${script.panels.length}-panel comic strip in ${style} style showing a ${persona} feeling "${mood}". `

  // Add panel-specific instructions with EXACT captions
  script.panels.forEach((panel, index) => {
    prompt += `Panel ${index + 1}: ${panel.description} IMPORTANT: Use EXACTLY this text in the speech bubble: "${panel.caption}" - do not change or replace this text. `
  })

  // Add layout instructions
  if (layout === "horizontal") {
    prompt += `Arrange the panels in a horizontal row from left to right. `
  } else if (layout === "vertical") {
    prompt += `Arrange the panels vertically from top to bottom. `
  } else if (layout === "square") {
    if (script.panels.length === 3) {
      prompt += `Arrange the panels in a grid: two panels on top and one panel on the bottom spanning the width of the two above. `
    } else {
      prompt += `Arrange the panels in a 2x2 grid. `
    }
  } else if (layout === "carousel") {
    prompt += `Arrange the panels in a horizontal row from left to right. `
  }

  prompt += `Make each panel clearly separated within a single image with comic-style borders between panels. CRITICAL: Use the EXACT speech bubble text provided for each panel - do not modify, replace, or create new text.`

  return prompt
}
