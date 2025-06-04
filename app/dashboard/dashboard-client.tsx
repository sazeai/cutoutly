"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ImageGallery } from "@/components/dashboard/image-gallery"
import { generateCutoutly } from "@/app/actions/generate-cutoutly"
import { createClient } from "@/utils/supabase/client"
import { ModeToggle } from "@/components/dashboard/mode-toggle"
import { CustomPromptForm } from "@/components/dashboard/custom-prompt-form"
import useSWR from "swr"

interface DashboardClientProps {
  user: any
}

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }
  return response.json()
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentCartoonId, setCurrentCartoonId] = useState<string | null>(null)
  const [savedFaceId, setSavedFaceId] = useState<string | null>(null)
  const [isLoadingFace, setIsLoadingFace] = useState(true)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [pendingImageId, setPendingImageId] = useState<string | null>(null)

  // Fetch cartoons using SWR with caching
  const { data: cartoonsData, error: cartoonsError, mutate: mutateCartoons } = useSWR(
    user?.id ? `/api/cutoutly/cartoons?limit=12&status=completed` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  // Fetch saved face using SWR with caching
  const { data: savedFaceData, error: savedFaceError } = useSWR(
    savedFaceId ? `/api/cutoutly/saved-face/${savedFaceId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // Initialize saved face ID from localStorage
  useEffect(() => {
    const storedFaceId = localStorage.getItem("cutoutly_saved_face_id")
    if (storedFaceId) {
      setSavedFaceId(storedFaceId)
    }
    setIsLoadingFace(false)
  }, [])

  // Poll for status updates when generating
  useEffect(() => {
    if (!currentCartoonId || !isGenerating) return

    const checkStatus = async () => {
      try {
        const supabase = createClient()

        // Get the cartoon status
        const { data: cartoon, error } = await supabase
          .from("cutoutly_cartoons")
          .select("*")
          .eq("id", currentCartoonId)
          .single()

        if (error) {
          throw new Error(`Status check failed: ${error.message}`)
        }

        // Handle different statuses
        if (cartoon.status === "completed") {
          setIsGenerating(false)
          setCurrentCartoonId(null)

          // Add the new image to the gallery
          if (cartoon.output_image_path) {
            // Set the pending image ID to avoid duplicates
            setPendingImageId(cartoon.id)

            // Revalidate the cartoons data
            mutateCartoons()

            // Clear the pending image ID after a short delay
            setTimeout(() => {
              setPendingImageId(null)
            }, 500)
          }

          toast({
            title: "Cartoon generated!",
            description: "Your cartoon PNG has been created successfully.",
          })
          return
        }

        if (cartoon.status === "failed") {
          setIsGenerating(false)
          setCurrentCartoonId(null)
          toast({
            title: "Generation failed",
            description: cartoon.error_message || "An unexpected error occurred.",
            variant: "destructive",
          })
          return
        }

        // If still processing, trigger the next processing step
        if (cartoon.status === "processing") {
          // Call the process endpoint to continue processing
          await fetch(`/api/cutoutly/process/${currentCartoonId}`, {
            method: "POST",
          })
        }
      } catch (error) {
        console.error("Error checking cartoon status:", error)
      }
    }

    // Check status immediately and then every 3 seconds
    checkStatus()
    const statusInterval = setInterval(checkStatus, 3000)

    return () => clearInterval(statusInterval)
  }, [currentCartoonId, isGenerating, toast, mutateCartoons])

  // Handle structured form submission
  const handleGenerateStructured = async (formData: any) => {
    try {
      setIsGenerating(true)

      const result = await generateCutoutly({
        image: formData.image,
        savedFaceId: formData.savedFaceId || null,
        pose: formData.pose,
        prop: formData.prop,
        style: formData.style,
        expression: formData.expression,
        speechBubble: formData.speechBubble,
        useCase: formData.useCase,
        size: formData.size,
        isCustomMode: false,
      })

      if (result.success && result.cartoonId) {
        setCurrentCartoonId(result.cartoonId)
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        })
        setIsGenerating(false)
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  // Handle custom prompt submission
  const handleGenerateCustom = async (data: { prompt: string; size: string }) => {
    try {
      setIsGenerating(true)

      const result = await generateCutoutly({
        customPrompt: data.prompt,
        size: data.size,
        isCustomMode: true,
      })

      if (result.success && result.cartoonId) {
        setCurrentCartoonId(result.cartoonId)
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        })
        setIsGenerating(false)
      }
    } catch (error) {
      console.error("Custom prompt generation error:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  // Handle saved face updates
  const handleSavedFaceChange = (faceId: string | null) => {
    setSavedFaceId(faceId)
    if (faceId) {
      localStorage.setItem("cutoutly_saved_face_id", faceId)
    } else {
      localStorage.removeItem("cutoutly_saved_face_id")
    }
  }

  // Handle mode toggle
  const handleModeChange = (mode: boolean) => {
    setIsCustomMode(mode)
  }

  // Handle image deletion
  const handleImageDeleted = async (imageId: string) => {
    try {
      const response = await fetch(`/api/cutoutly/delete-image/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      // Revalidate the cartoons data
      mutateCartoons()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  // Transform cartoons data for the gallery
  const generatedImages = cartoonsData?.cartoons?.map((cartoon: any) => ({
    id: cartoon.id,
    url: cartoon.image_url || "",
    createdAt: cartoon.created_at,
  })) || []

  return (
    <div className="container mx-auto pt-24 pb-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-6">
        {/* Left Panel - Control Form */}
        <div className="lg:col-span-1">
          <ModeToggle onModeChange={handleModeChange} isCustomMode={isCustomMode} />

          {isCustomMode ? (
            <CustomPromptForm onGenerate={handleGenerateCustom} isGenerating={isGenerating} />
          ) : (
            <DashboardSidebar
              onGenerate={handleGenerateStructured}
              isGenerating={isGenerating}
              savedFaceId={savedFaceId}
              isLoadingFace={isLoadingFace}
              onSavedFaceChange={handleSavedFaceChange}
            />
          )}
        </div>

        {/* Right Panel - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery
            images={generatedImages}
            isGenerating={isGenerating}
            pendingImageId={pendingImageId}
            onImageDeleted={handleImageDeleted}
          />
        </div>
      </div>
    </div>
  )
}
