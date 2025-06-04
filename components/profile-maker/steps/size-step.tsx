"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SizeStepProps {
  value: string
  onChange: (value: string) => void
}

const sizes = [
  { id: "1024x1024", name: "Square", emoji: "⬛", description: "1024x1024" },
  { id: "1024x1536", name: "Portrait", emoji: "🟪", description: "1024x1536" },
  { id: "auto", name: "Auto", emoji: "✨", description: "Let AI decide" },
]

export function SizeStep({ value, onChange }: SizeStepProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select the size for your generated avatar
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2"
      >
        {sizes.map((size) => (
          <div key={size.id}>
            <RadioGroupItem value={size.id} id={size.id} className="peer sr-only" />
            <Label
              htmlFor={size.id}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
            >
              <span className="text-2xl mb-1">{size.emoji}</span>
              <span className="text-xs font-medium text-center">{size.name}</span>
              <span className="text-xs text-gray-500">{size.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
} 