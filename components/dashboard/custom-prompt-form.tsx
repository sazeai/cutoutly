"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface CustomPromptFormProps {
  onGenerate: (data: { prompt: string; size: string }) => void
  isGenerating: boolean
}

export function CustomPromptForm({ onGenerate, isGenerating }: CustomPromptFormProps) {
  const [prompt, setPrompt] = useState("")
  const [size, setSize] = useState("1024x1024")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) {
      setError("Please enter a description")
      return
    }

    setError(null)
    onGenerate({ prompt, size })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="custom-prompt" className="text-lg font-semibold">
            Describe what you want to create
          </Label>
          <Textarea
            id="custom-prompt"
            placeholder="E.g., A cute cat sitting and yawning, with a sleepy expression"
            className="min-h-[150px] border-2 border-gray-200 focus:border-teal-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="bg-yellow-50 p-3 rounded-lg text-sm mt-2">
            <p className="font-semibold mb-1">Tips for great results:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Be specific about what you want to see</li>
              <li>Mention style, colors, and mood</li>
              <li>Describe poses and expressions clearly</li>
              <li>Keep it under 200 words for best results</li>
            </ul>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="size-select" className="text-lg font-semibold">
            Select Size
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className={`border-2 ${
                size === "1024x1024" ? "border-teal-500 bg-teal-50" : "border-gray-200"
              } rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors`}
              onClick={() => setSize("1024x1024")}
            >
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">1:1</span>
              </div>
              <span className="text-sm font-medium">Square</span>
            </div>

            <div
              className={`border-2 ${
                size === "1024x1536" ? "border-teal-500 bg-teal-50" : "border-gray-200"
              } rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors`}
              onClick={() => setSize("1024x1536")}
            >
              <div className="aspect-[2/3] bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">2:3</span>
              </div>
              <span className="text-sm font-medium">Portrait</span>
            </div>

            <div
              className={`border-2 ${
                size === "1536x1024" ? "border-teal-500 bg-teal-50" : "border-gray-200"
              } rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors`}
              onClick={() => setSize("1536x1024")}
            >
              <div className="aspect-[3/2] bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">3:2</span>
              </div>
              <span className="text-sm font-medium">Landscape</span>
            </div>

            <div
              className={`border-2 ${
                size === "auto" ? "border-teal-500 bg-teal-50" : "border-gray-200"
              } rounded-lg p-3 text-center cursor-pointer hover:border-teal-500 transition-colors`}
              onClick={() => setSize("auto")}
            >
              <div className="aspect-auto h-[40px] bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">Auto</span>
              </div>
              <span className="text-sm font-medium">Auto</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-teal-500 to-yellow-400 hover:from-teal-600 hover:to-yellow-500 text-white font-bold py-3 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Custom PNG"
          )}
        </Button>
      </form>
    </div>
  )
}
