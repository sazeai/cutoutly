"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PropStepProps {
  value: string
  onChange: (value: string) => void
}

export function PropStep({ value, onChange }: PropStepProps) {
  const props = [
    { id: "none", name: "No Prop", emoji: "🚫" },
    { id: "laptop", name: "Laptop Mockup", emoji: "🖥" },
    { id: "product", name: "Product Box", emoji: "📦" },
    { id: "slide", name: "Pitch Deck Slide", emoji: "📊" },
    { id: "mic", name: "Microphone", emoji: "🎙" },
    { id: "scroll", name: "Scroll/Newsletter", emoji: "🧾" },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-2">
        {props.map((prop) => (
          <div key={prop.id}>
            <RadioGroupItem value={prop.id} id={`prop-${prop.id}`} className="peer sr-only" />
            <Label
              htmlFor={`prop-${prop.id}`}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
            >
              <span className="text-2xl mb-1">{prop.emoji}</span>
              <span className="text-xs font-medium text-center">{prop.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
