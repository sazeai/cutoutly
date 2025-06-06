"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { generateAvatar } from "@/app/actions/generate-avatar"
import { createClient } from "@/utils/supabase/client"
import { ImageGallery } from "@/components/dashboard/image-gallery"
import { ProfileMakerSidebar } from "@/components/profile-maker/profile-maker-sidebar"

interface ProfileMakerClientProps {
  user: any
}

export function ProfileMakerClient({ user }: ProfileMakerClientProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentAvatarId, setCurrentAvatarId] = useState<string | null>(null)
  const [savedFaceId, setSavedFaceId] = useState<string | null>(null)
  const [isLoadingFace, setIsLoadingFace] = useState(true)
  const [generatedImages, setGeneratedImages] = useState<
    Array<{
      id: string
      url: string
      createdAt: string
    }>
  >([])
  const [pendingImageId, setPendingImageId] = useState<string | null>(null)

  // Fetch existing avatars and saved face on page load
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoadingFace(true)
      try {
        // Fetch avatars
        const supabase = createClient()
        const { data: avatars } = await supabase
          .from("cutoutly_avatars")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(12)

        if (avatars) {
          setGeneratedImages(
            avatars.map((avatar: any) => ({
              id: avatar.id,
              url: avatar.output_image_path
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cutoutly/${avatar.output_image_path}`
                : "",
              createdAt: avatar.created_at,
            })),
          )
        }

        // Try to get saved face ID from localStorage first
        const storedFaceId = localStorage.getItem("cutoutly_saved_profile_face_id")

        if (storedFaceId) {
          // Verify the saved face exists in the database
          const { data: savedFace, error } = await supabase
            .from("cutoutly_saved_profile_faces")
            .select("*")
            .eq("id", storedFaceId)
            .single()

          if (savedFace) {
            setSavedFaceId(storedFaceId)
          } else {
            // If not found, try to get the most recent saved face
            const { data: recentFace } = await supabase
              .from("cutoutly_saved_profile_faces")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            if (recentFace) {
              localStorage.setItem("cutoutly_saved_profile_face_id", recentFace.id)
              setSavedFaceId(recentFace.id)
            } else {
              localStorage.removeItem("cutoutly_saved_profile_face_id")
              setSavedFaceId(null)
            }
          }
        } else {
          // If no localStorage item, get the most recent saved face
          const { data: recentFace } = await supabase
            .from("cutoutly_saved_profile_faces")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single()

          if (recentFace) {
            localStorage.setItem("cutoutly_saved_profile_face_id", recentFace.id)
            setSavedFaceId(recentFace.id)
          } else {
            setSavedFaceId(null)
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

  // Check status of current avatar generation
  useEffect(() => {
    if (!currentAvatarId || !isGenerating) return

    const statusInterval = setInterval(async () => {
      try {
        const supabase = createClient()

        // Get the avatar status
        const { data: avatar, error } = await supabase
          .from("cutoutly_avatars")
          .select("*")
          .eq("id", currentAvatarId)
          .single()

        if (error) {
          throw new Error(`Status check failed: ${error.message}`)
        }

        // Handle different statuses
        if (avatar.status === "completed") {
          setIsGenerating(false)
          setCurrentAvatarId(null)
          clearInterval(statusInterval)
          
          // Add the new image to the gallery immediately
          if (avatar.output_image_path) {
            const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/cutoutly/${avatar.output_image_path}`
            
            // Add the new image to the beginning of the array
            setGeneratedImages(prev => [{
              id: avatar.id,
              url: imageUrl,
              createdAt: avatar.created_at,
            }, ...prev])

            toast({
              title: "Avatar generated!",
              description: "Your profile picture has been created successfully.",
            })
          }
          return
        }

        if (avatar.status === "failed") {
          setIsGenerating(false)
          setCurrentAvatarId(null)
          clearInterval(statusInterval)
          toast({
            title: "Generation failed",
            description: avatar.error_message || "An unexpected error occurred.",
            variant: "destructive",
          })
          return
        }

        // If still processing, trigger the next processing step
        if (avatar.status === "processing") {
          // Call the process endpoint to continue processing
          await fetch(`${window.location.origin}/api/cutoutly/process-avatar/${currentAvatarId}`, {
            method: "POST",
          })
        }
      } catch (error) {
        console.error("Error checking avatar status:", error)
        setIsGenerating(false)
        setCurrentAvatarId(null)
        clearInterval(statusInterval)
        toast({
          title: "Error",
          description: "Failed to check avatar status. Please try again.",
          variant: "destructive",
        })
      }
    }, 2000)

    return () => clearInterval(statusInterval)
  }, [currentAvatarId, isGenerating, toast])

  // Handle form submission
  const handleGenerate = async (formData: any) => {
    try {
      setIsGenerating(true)

      const result = await generateAvatar({
        image: formData.image,
        savedFaceId: formData.savedFaceId || null,
        style: formData.style,
        expression: formData.expression,
        userId: user.id,
      })

      if (result.success && result.avatarId) {
        setCurrentAvatarId(result.avatarId)
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

  // Handle saved face updates
  const handleSavedFaceChange = (faceId: string | null) => {
    setSavedFaceId(faceId)
    if (faceId) {
      localStorage.setItem("cutoutly_saved_profile_face_id", faceId)
    } else {
      localStorage.removeItem("cutoutly_saved_profile_face_id")
    }
  }

  // Handle image deletion
  const handleImageDeleted = (imageId: string) => {
    setGeneratedImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  return (
    <div className="container mx-auto pt-24 pb-12 px-4">
    

      <div className="grid mt-6 grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Control Form */}
        <div className="lg:col-span-1">
          <ProfileMakerSidebar
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            savedFaceId={savedFaceId}
            isLoadingFace={isLoadingFace}
            onSavedFaceChange={handleSavedFaceChange}
          />
        </div>

        {/* Right Panel - Image Gallery */}
        <div className="lg:col-span-2">
          <ImageGallery
            images={generatedImages}
            isGenerating={isGenerating}
            pendingImageId={currentAvatarId}
            onImageDeleted={handleImageDeleted}
          />
        </div>
      </div>
    </div>
  )
} 