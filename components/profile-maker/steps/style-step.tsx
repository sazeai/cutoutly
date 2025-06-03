"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StyleStepProps {
  style: string
  expression: string
  onStyleChange: (style: string) => void
  onExpressionChange: (expression: string) => void
}

const styles = [
  { id: "3d_cartoon", name: "3D Cartoon", emoji: "🎨", description: "3D cartoon style with soft shadows and Pixar-style features" },
  { id: "ghibli", name: "Ghibli", emoji: "🎭", description: "Studio Ghibli inspired art with wholesome vibes" },
  { id: "comic", name: "Comic", emoji: "💥", description: "Comic book style with bold outlines and dynamic contrast" },
  { id: "line_art", name: "Line Art", emoji: "✏️", description: "Minimalist black and white line sketch style" },
  { id: "anime", name: "Anime", emoji: "✨", description: "Anime portrait style with large expressive eyes" },
  { id: "pixel", name: "Pixel", emoji: "👾", description: "Retro pixel art style in 8-bit or 16-bit resolution" },
  { id: "watercolor", name: "Watercolor", emoji: "🎨", description: "Soft watercolor painting style with textured paper feel" },
  { id: "cyberpunk", name: "Cyberpunk", emoji: "🤖", description: "Futuristic style with neon accents and sci-fi elements" },
  { id: "retro_pop", name: "Retro Pop", emoji: "🕹️", description: "Retro pop art style with bold colors and vintage textures" },
  { id: "paper_cutout", name: "Paper Cutout", emoji: "✂️", description: "Layered paper cutout style with flat shadows" },
  { id: "vector", name: "Vector", emoji: "📐", description: "Minimal vector flat style with solid colors" },
  { id: "fantasy", name: "Fantasy", emoji: "🧙", description: "Fantasy illustration style with magical elements" },
  { id: "realistic", name: "Realistic", emoji: "📸", description: "Photorealistic style with natural lighting" },
  { id: "cartoon", name: "Cartoon", emoji: "🎯", description: "Classic cartoon style with bold colors" },
  { id: "disney", name: "Disney", emoji: "✨", description: "Classic Disney animation style with magical charm" },
  { id: "pixar", name: "Pixar", emoji: "🎬", description: "Modern Pixar 3D animation style" },
  { id: "vector_line_art", name: "Vector Line Art", emoji: "✒️", description: "Bold black line art with warm gradients" },
  { id: "cute_vector", name: "Cute Vector", emoji: "💝", description: "Soft minimalist style with pastel colors" },
]

const expressions = [
  { id: "happy", name: "Happy", emoji: "😊", description: "Warm, cheerful smile with bright eyes" },
  { id: "cool", name: "Cool", emoji: "😎", description: "Confident, relaxed expression with a slight smirk" },
  { id: "professional", name: "Professional", emoji: "👔", description: "Polite, composed smile suitable for work" },
  { id: "friendly", name: "Friendly", emoji: "😄", description: "Approachable, welcoming expression" },
  { id: "playful", name: "Playful", emoji: "😋", description: "Fun, mischievous look with a playful smile" },
  { id: "thoughtful", name: "Thoughtful", emoji: "🤔", description: "Contemplative expression with a gentle smile" },
  { id: "energetic", name: "Energetic", emoji: "⚡", description: "Dynamic, enthusiastic expression" },
  { id: "calm", name: "Calm", emoji: "😌", description: "Peaceful, serene expression" },
  { id: "mysterious", name: "Mysterious", emoji: "🕵️", description: "Intriguing, enigmatic expression" },
  { id: "determined", name: "Determined", emoji: "💪", description: "Strong, focused expression" },
]

export function StyleStep({ style, expression, onStyleChange, onExpressionChange }: StyleStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
    
        <p className="text-sm text-muted-foreground">Choose your preferred style and expression for your profile picture.</p>
      </div>

      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="expression">Expression</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {styles.map((s) => (
              <Card
                key={s.id}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center p-4 transition-all hover:bg-gray-50",
                  style === s.id && "border-primary bg-primary-light",
                )}
                onClick={() => onStyleChange(s.id)}
              >
                <img
                  src="/styles/pixar.jpg"
                  alt={s.name}
                  className="mb-2 w-8 h-8 rounded-full object-cover border border-gray-200"
                />
                <span className="text-sm font-medium">{s.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expression" className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {expressions.map((e) => (
              <Card
                key={e.id}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center p-4 transition-all hover:bg-gray-50",
                  expression === e.id && "border-primary bg-primary-light",
                )}
                onClick={() => onExpressionChange(e.id)}
              >
                <span className="mb-2 text-2xl">{e.emoji}</span>
                <span className="text-sm font-medium">{e.name}</span>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 