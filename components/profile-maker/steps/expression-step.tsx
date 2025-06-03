"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ExpressionStepProps {
  value: string
  onChange: (value: string) => void
}

const expressions = [
  { id: "happy", name: "Happy", emoji: "😊" },
  { id: "smile", name: "Smile", emoji: "😃" },
  { id: "cool", name: "Cool", emoji: "😎" },
  { id: "serious", name: "Serious", emoji: "😐" },
  { id: "playful", name: "Playful", emoji: "😜" },
]

export function ExpressionStep({ value, onChange }: ExpressionStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Choose Your Expression</h3>
      <p className="text-sm text-muted-foreground">
        Select the expression for your avatar
      </p>

      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-3 gap-2"
      >
        {expressions.map((expression) => (
          <div key={expression.id}>
            <RadioGroupItem value={expression.id} id={expression.id} className="peer sr-only" />
            <Label
              htmlFor={expression.id}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
            >
              <span className="text-2xl mb-1">{expression.emoji}</span>
              <span className="text-xs font-medium text-center">{expression.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
} 