"use client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface UseCaseStepProps {
  value: string
  onChange: (value: string) => void
}

export function UseCaseStep({ value, onChange }: UseCaseStepProps) {
  const useCases = [
    { id: "website", name: "Website Hero", emoji: "🌐" },
    { id: "pitch", name: "Pitch Deck", emoji: "📊" },
    { id: "producthunt", name: "Product Hunt", emoji: "😺" },
    { id: "course", name: "Course Thumbnail", emoji: "🎓" },
    { id: "twitter", name: "Twitter/X Post", emoji: "🐦" },
    { id: "newsletter", name: "Newsletter", emoji: "📧" },
    { id: "ad", name: "Ad Campaign", emoji: "📣" },
    { id: "none", name: "Custom", emoji: "🎨" },
  ]

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Optional: Choose a use case to optimize your cartoon for specific platforms
      </p>

      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-3 gap-2">
        {useCases.map((useCase) => (
          <div key={useCase.id}>
            <RadioGroupItem value={useCase.id} id={`usecase-${useCase.id}`} className="peer sr-only" />
            <Label
              htmlFor={`usecase-${useCase.id}`}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
            >
              <span className="text-2xl mb-1">{useCase.emoji}</span>
              <span className="text-xs font-medium text-center">{useCase.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="text-xs text-gray-500">
        <p>Selecting a use case will set transparent background and suggest ideal pose + props</p>
      </div>
    </div>
  )
}
