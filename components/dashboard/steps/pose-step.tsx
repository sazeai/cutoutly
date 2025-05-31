"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PoseStepProps {
  value: string
  onChange: (value: string) => void
}

export function PoseStep({ value, onChange }: PoseStepProps) {
  const poses = [
    { id: "pointing", name: "Pointing Forward", emoji: "👍" },
    { id: "waving", name: "Waving", emoji: "✋" },
    { id: "desk", name: "Sitting at Desk", emoji: "💻" },
    { id: "phone", name: "Holding a Phone", emoji: "📱" },
    { id: "talking", name: "Talking Gesture", emoji: "💬" },
    { id: "celebration", name: "Party/Celebration", emoji: "🥳" },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-2">
        {poses.map((pose) => (
          <div key={pose.id}>
            <RadioGroupItem value={pose.id} id={pose.id} className="peer sr-only" />
            <Label
              htmlFor={pose.id}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
            >
              <span className="text-2xl mb-1">{pose.emoji}</span>
              <span className="text-xs font-medium text-center">{pose.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
