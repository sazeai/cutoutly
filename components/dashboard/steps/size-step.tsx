"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SizeStepProps {
  value: string
  onChange: (value: string) => void
}

export function SizeStep({ value, onChange }: SizeStepProps) {
  const sizes = [
    {
      id: "auto",
      name: "Auto",
      description: "Let AI decide",
      preview: (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M21 3H3v18h18V3z" />
            <path d="M21 11H3" />
            <path d="M11 3v18" />
          </svg>
        </div>
      ),
    },
    {
      id: "1024x1024",
      name: "Square",
      description: "1024×1024",
      preview: <div className="h-16 w-16 aspect-square border-green-200 border-2 bg-primary-light rounded-md"></div>,
    },
    {
      id: "1536x1024",
      name: "Landscape",
      description: "1536×1024",
      preview: <div className="w-full h-8 bg-primary-light border-green-200 border-2 rounded-md"></div>,
    },
    {
      id: "1024x1536",
      name: "Portrait",
      description: "1024×1536",
      preview: <div className="h-full w-8 mx-auto bg-primary-light border-green-200 border-2 rounded-md"></div>,
    },
  ]

  return (
    <div className="space-y-4">
      <RadioGroup value={value} onValueChange={onChange} className="grid grid-cols-2 gap-4">
        {sizes.map((size) => (
          <div key={size.id}>
            <RadioGroupItem value={size.id} id={`size-${size.id}`} className="peer sr-only" />
            <Label
              htmlFor={`size-${size.id}`}
              className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light"
            >
              <div className="h-16 w-full flex items-center justify-center mb-2">{size.preview}</div>
              <span className="text-sm font-medium">{size.name}</span>
              <span className="text-xs text-gray-500">{size.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
