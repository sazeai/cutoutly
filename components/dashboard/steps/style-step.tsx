"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface StyleStepProps {
  style: string
  expression: string
  onStyleChange: (value: string) => void
  onExpressionChange: (value: string) => void
}

export function StyleStep({ style, expression, onStyleChange, onExpressionChange }: StyleStepProps) {
  const styles = [
    { id: "cute", name: "Cute Bubble", emoji: "🥰" },
    { id: "ghibli", name: "Ghibli", emoji: "✨" },
    { id: "techy", name: "Techy/Clean", emoji: "🤖" },
    { id: "handdrawn", name: "Hand-drawn", emoji: "✏️" },
    { id: "cyberpunk", name: "Cyberpunk", emoji: "🌃" },
    { id: "sketch", name: "Sketch", emoji: "🎨" },
  ]

  const expressions = [
    { id: "happy", name: "Happy", emoji: "😊" },
    { id: "excited", name: "Excited", emoji: "🤩" },
    { id: "confident", name: "Confident", emoji: "😎" },
    { id: "curious", name: "Curious", emoji: "🤔" },
    { id: "chill", name: "Chill", emoji: "😌" },
    { id: "cracked", name: "Cracked", emoji: "🤯" },
    { id: "burnout", name: "Burnt Out", emoji: "😩" },
  ]

  return (
    <div className="space-y-4">
      <Tabs defaultValue="style" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="expression">Expression</TabsTrigger>
        </TabsList>

        <TabsContent value="style">
          <RadioGroup value={style} onValueChange={onStyleChange} className="grid grid-cols-3 gap-2">
            {styles.map((s) => (
              <div key={s.id}>
                <RadioGroupItem value={s.id} id={`style-${s.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`style-${s.id}`}
                  className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
                >
                  <span className="text-2xl mb-1">{s.emoji}</span>
                  <span className="text-xs font-medium text-center">{s.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>

        <TabsContent value="expression">
          <RadioGroup value={expression} onValueChange={onExpressionChange} className="grid grid-cols-3 gap-2">
            {expressions.map((e) => (
              <div key={e.id}>
                <RadioGroupItem value={e.id} id={`expression-${e.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`expression-${e.id}`}
                  className="flex flex-col items-center justify-center border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary-light h-[80px]"
                >
                  <span className="text-2xl mb-1">{e.emoji}</span>
                  <span className="text-xs font-medium text-center">{e.name}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}
