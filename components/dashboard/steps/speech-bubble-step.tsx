"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SpeechBubbleStepProps {
  value: string
  onChange: (value: string) => void
}

export function SpeechBubbleStep({ value, onChange }: SpeechBubbleStepProps) {
  const presets = [
    "Try it now!",
    "New drop!",
    "Live on Product Hunt",
    "Subscribe to my newsletter",
    "Investor ghosted me again…",
    "Just shipped!",
  ]

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your speech bubble text..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] border-2 border-gray-200 rounded-lg"
      />

      <div>
        <p className="text-sm font-medium mb-2">Or choose a preset:</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(preset)}
              className={`border ${value === preset ? "border-primary bg-primary-light" : "border-gray-200"}`}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Keep it short and punchy for best results</p>
        <p>Max 50 characters recommended</p>
      </div>
    </div>
  )
}
