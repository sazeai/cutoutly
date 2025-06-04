"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface PreviewStepProps {
  style: string
  expression: string
  outfit: string
  onGenerate: () => void
  isGenerating: boolean
  onBack: () => void
}

export function PreviewStep({
  style,
  expression,
  outfit,
  onGenerate,
  isGenerating,
  onBack,
}: PreviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Preview Your Avatar</h3>
        <p className="text-sm text-muted-foreground">
          Review your selections and generate your avatar when ready.
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Style</h4>
              <p className="text-sm text-muted-foreground capitalize">{style}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Expression</h4>
              <p className="text-sm text-muted-foreground capitalize">{expression}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Outfit</h4>
              <p className="text-sm text-muted-foreground capitalize">{outfit}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Preview will appear here</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back: Outfit
        </Button>
        <Button onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Avatar"
          )}
        </Button>
      </div>
    </div>
  )
} 