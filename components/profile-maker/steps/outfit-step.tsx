"use client"

import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface OutfitStepProps {
  value: string
  onChange: (value: string) => void
}

const outfits = [
  { id: "none", name: "None", emoji: "👤", description: "No specific outfit" },
  { id: "casual", name: "Casual", emoji: "👕", description: "Everyday casual wear" },
  { id: "formal", name: "Formal", emoji: "🤵", description: "Professional attire" },
  { id: "sporty", name: "Sporty", emoji: "🏃", description: "Athletic wear" },
  { id: "fantasy", name: "Fantasy", emoji: "🧙", description: "Fantasy-themed outfit" },
  { id: "futuristic", name: "Futuristic", emoji: "🤖", description: "Tech-inspired wear" },
]

export function OutfitStep({ value, onChange }: OutfitStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the outfit style for your avatar
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2"
      >
        {outfits.map((outfit) => (
          <div key={outfit.id}>
            <RadioGroupItem value={outfit.id} id={outfit.id} className="peer sr-only" />
            <Label
              htmlFor={outfit.id}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[100px]"
            >
              <span className="text-2xl mb-1">{outfit.emoji}</span>
              <span className="text-xs font-medium text-center">{outfit.name}</span>
              <span className="text-[10px] text-gray-500 text-center line-clamp-2">{outfit.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
} 