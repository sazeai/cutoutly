"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UploadStep } from "./steps/upload-step"
import { StyleStep } from "./steps/style-step"

interface ProfileMakerSidebarProps {
  onGenerate: (formData: any) => void
  isGenerating: boolean
  savedFaceId?: string | null
  isLoadingFace?: boolean
  onSavedFaceChange?: (faceId: string | null) => void
}

export function ProfileMakerSidebar({
  onGenerate,
  isGenerating,
  savedFaceId = null,
  isLoadingFace = false,
  onSavedFaceChange,
}: ProfileMakerSidebarProps) {
  const { toast } = useToast()
  const [activeStep, setActiveStep] = useState("1")
  const [formData, setFormData] = useState({
    image: null,
    savedFaceId: savedFaceId,
    style: "realistic",
    expression: "smiling",
  })

  // Update formData when savedFaceId prop changes
  useEffect(() => {
    if (savedFaceId !== formData.savedFaceId) {
      setFormData((prev) => ({ ...prev, savedFaceId }))
    }
  }, [savedFaceId, formData.savedFaceId])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // If updating savedFaceId, call the callback
    if (field === "savedFaceId" && onSavedFaceChange) {
      onSavedFaceChange(value)
    }
  }

  const handleNext = () => {
    const currentStep = Number.parseInt(activeStep)
    if (currentStep === 1) {
      // Check if there's a new upload that hasn't been saved
      const hasNewUpload = formData.image && !formData.savedFaceId
      if (hasNewUpload) {
        toast({
          title: "Please save your face",
          description: "You need to save your face before proceeding to the next step.",
          variant: "destructive",
        })
        return
      }
    }
    if (currentStep < 2) {
      setActiveStep((currentStep + 1).toString())
    }
  }

  const handlePrevious = () => {
    const currentStep = Number.parseInt(activeStep)
    if (currentStep > 1) {
      setActiveStep((currentStep - 1).toString())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
  }

  return (
    <Card className="border-2 border-black rounded-xl bg-white p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
      <form onSubmit={handleSubmit}>
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            {[...Array(2)].map((_, i) => (
              <TabsTrigger
                key={i}
                value={(i + 1).toString()}
                className={`${
                  Number.parseInt(activeStep) === i + 1
                    ? "bg-primary text-white"
                    : Number.parseInt(activeStep) > i + 1
                      ? "bg-primary-light"
                      : ""
                }`}
              >
                {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="1">
            <h3 className="text-xl font-bold mb-4">Upload Face</h3>
            <UploadStep
              value={formData.image}
              onChange={(value) => updateFormData("image", value)}
              savedFaceId={formData.savedFaceId}
              isLoadingFace={isLoadingFace}
              onSavedFaceChange={(value) => updateFormData("savedFaceId", value)}
              onNext={handleNext}
            />
          </TabsContent>

          <TabsContent value="2">
            <h3 className="text-xl font-bold mb-4">Style & Expression</h3>
            <StyleStep
              style={formData.style}
              expression={formData.expression}
              onStyleChange={(value) => updateFormData("style", value)}
              onExpressionChange={(value) => updateFormData("expression", value)}
            />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button
                type="submit"
                className="rounded-xl text-black border-2 border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all hover:text-white"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Create Avatar"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Card>
  )
} 