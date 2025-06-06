"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { UploadStep } from "./steps/upload-step"
import { PoseStep } from "./steps/pose-step"
import { PropStep } from "./steps/prop-step"
import { StyleStep } from "./steps/style-step"
import { SpeechBubbleStep } from "./steps/speech-bubble-step"
import { UseCaseStep } from "./steps/use-case-step"
import { SizeStep } from "./steps/size-step"

interface DashboardSidebarProps {
  onGenerate: (formData: any) => void
  isGenerating: boolean
  savedFaceId?: string | null
  isLoadingFace?: boolean
  onSavedFaceChange?: (faceId: string | null) => void
}

export function DashboardSidebar({
  onGenerate,
  isGenerating,
  savedFaceId = null,
  isLoadingFace = false,
  onSavedFaceChange,
}: DashboardSidebarProps) {
  const [activeStep, setActiveStep] = useState("1")
  const [formData, setFormData] = useState({
    image: null,
    savedFaceId: savedFaceId,
    pose: "pointing",
    prop: "none",
    style: "cute",
    expression: "happy",
    speechBubble: "",
    useCase: "website",
    size: "1024x1024",
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
    if (currentStep < 7) {
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
          <TabsList className="grid grid-cols-7 mb-4">
            {[...Array(7)].map((_, i) => (
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
            <h3 className="text-xl font-bold mb-4">Choose Pose</h3>
            <PoseStep value={formData.pose} onChange={(value) => updateFormData("pose", value)} />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="3">
            <h3 className="text-xl font-bold mb-4">Add Prop or Object</h3>
            <PropStep value={formData.prop} onChange={(value) => updateFormData("prop", value)} />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="4">
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
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="5">
            <h3 className="text-xl font-bold mb-4">Add Speech Bubble</h3>
            <SpeechBubbleStep
              value={formData.speechBubble}
              onChange={(value) => updateFormData("speechBubble", value)}
            />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="6">
            <h3 className="text-xl font-bold mb-4">Use Case Template</h3>
            <UseCaseStep value={formData.useCase} onChange={(value) => updateFormData("useCase", value)} />
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="7">
            <h3 className="text-xl font-bold mb-4">Size Selection</h3>
            <SizeStep value={formData.size} onChange={(value) => updateFormData("size", value)} />
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
                  "Create PNG"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Card>
  )
}
