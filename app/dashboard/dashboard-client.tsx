"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ImageGallery } from "@/components/dashboard/image-gallery"
import { generateCutoutly } from "@/app/actions/generate-cutoutly"
import { createClient } from "@/utils/supabase/client"
import { ModeToggle } from "@/components/dashboard/mode-toggle"
import { CustomPromptForm } from "@/components/dashboard/custom-prompt-form"

interface DashboardClientProps {
  user: any
}

export function DashboardClient({ user }: DashboardClientProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentCartoonId, setCurrentCartoonId] = useState<string | null>(null)
  const [savedFaceId, setSavedFaceId] = useState<string | null>(null)
  const [isLoadingFace, setIsLoadingFace] = useState(true)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<
    Array<{
      id: string
      url: string
      createdAt: string
    }>
  >([])
  const [pendingImageId, setPendingImageId] = useState<string | null>(null)

  // Fetch existing cartoons and saved face on page load
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingFace(true)
      try {
        // Fetch cartoons
        const supabase = createClient()
        const { data: cartoons } = await supabase
          .from("cutoutly_cartoons")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(12)

        if (cartoons) {
          setGeneratedImages(
            cartoons.map((cartoon: any) => ({
              id: cartoon.id,
              url: cartoon.output_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cutoutly/${cartoon.output_image_path}`
                : "",
              createdAt: cartoon.created_at,
            })),
          )
        }

        // Try to get saved face ID from localStorage first
        const storedFaceId = localStorage.getItem("cutoutly_saved_face_id")

        if (storedFaceId) {
          // Verify the saved face exists in the database
          const { data: savedFace, error } = await supabase
            .from("cutoutly_saved_faces")
            .select("*")
            .eq("id", storedFaceId)
            .single()

          if (savedFace) {
            setSavedFaceId(storedFaceId)
          } else {
            // If not found, try to get the most recent saved face
            const { data: recentFace } = await supabase
              .from("cutoutly_saved_faces")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            if (recentFace) {
              localStorage.setItem("cutoutly_saved_face_id", recentFace.id)
              setSavedFaceId(recentFace.id)
            } else {
              localStorage.removeItem("cutoutly_saved_face_id")
              setSavedFaceId(null)
            }
          }
        } else {
          // If no localStorage item, check if user has any saved faces
          const { data: recentFace } = await supabase
            .from("cutoutly_saved_faces")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          if (recentFace) {
            localStorage.setItem("cutoutly_saved_face_id", recentFace.id)
            setSavedFaceId(recentFace.id)
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoadingFace(false)
      }
    }

    if (user?.id) {
      fetchUserData()
    }
  }, [user?.id])

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
            const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cutoutly/${cartoon.output_image_path}`

            // Set the pending image ID to avoid duplicates
            setPendingImageId(cartoon.id)

            // Fetch the latest images to ensure we have the most up-to-date list
            const { data: latestCartoons } = await supabase
              .from("cutoutly_cartoons")
              .select("*")
              .eq("user_id", user.id)
              .eq("status", "completed")
              .order("created_at", { ascending: false })
              .limit(12)

            if (latestCartoons) {
              setGeneratedImages(
                latestCartoons.map((c: any) => ({
                  id: c.id,
                  url: c.output_image_path
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cutoutly/${c.output_image_path}`
                    : "",
                  createdAt: c.created_at,
                })),
              )
            }

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
  }, [currentCartoonId, isGenerating, toast, user.id])

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
        userId: user.id,
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
        userId: user.id,
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
  const handleImageDeleted = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
    <div className="container mx-auto pt-24 pb-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Cartoon PNG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
