"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/utils/supabase/client"

interface UploadStepProps {
  value: File | null
  onChange: (file: File | null) => void
  savedFaceId?: string | null
  isLoadingFace?: boolean
  onSavedFaceChange?: (faceId: string | null) => void
  onNext?: () => void
}

export function UploadStep({
  value,
  onChange,
  savedFaceId = null,
  isLoadingFace = false,
  onSavedFaceChange,
  onNext,
}: UploadStepProps) {
  const { toast } = useToast()
  const [preview, setPreview] = useState<string | null>(null)
  const [isSavingFace, setIsSavingFace] = useState(false)
  const [isFaceLocked, setIsFaceLocked] = useState(!!savedFaceId)
  const [savedFaceUrl, setSavedFaceUrl] = useState<string | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [hasNewUpload, setHasNewUpload] = useState(false)

  // Check for saved face on component mount or when savedFaceId changes
  useEffect(() => {
    if (savedFaceId) {
      fetchSavedFace(savedFaceId)
    } else {
      // Clear all states when no savedFaceId
      setIsFaceLocked(false)
      setPreview(null)
      setSavedFaceUrl(null)
      setHasNewUpload(false)
      localStorage.removeItem("cutoutly_saved_profile_face_id")
    }
  }, [savedFaceId])

  // Fetch saved face details
  const fetchSavedFace = async (faceId: string) => {
    // Don't fetch if no faceId
    if (!faceId) {
      setIsLoadingPreview(false)
      return
    }

    setIsLoadingPreview(true)
    try {
      // First try to get from Supabase directly
      const supabase = createClient()
      const { data: savedFace, error } = await supabase
        .from("cutoutly_saved_profile_faces")
        .select("*")
        .eq("id", faceId)
        .single()

      if (error || !savedFace) {
        // If face not found, just clear the state without treating it as an error
        if (onSavedFaceChange) {
          onSavedFaceChange(null)
        }
        localStorage.removeItem("cutoutly_saved_profile_face_id")
        setIsFaceLocked(false)
        setPreview(null)
        setSavedFaceUrl(null)
        setIsLoadingPreview(false)
        return
      }

      // Get the image URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("cutoutly").getPublicUrl(savedFace.face_image_path)

      // Verify the URL is accessible
      try {
        const res = await fetch(publicUrl)
        if (!res.ok) {
          throw new Error("Image URL not accessible")
        }
        const blob = await res.blob()
        const file = new File([blob], "saved-face.png", { type: "image/png" })
        onChange(file)
        setSavedFaceUrl(publicUrl)
        setIsFaceLocked(true)
        setPreview(publicUrl)
        setHasNewUpload(false)
      } catch (fetchError) {
        console.error("Error fetching image:", fetchError)
        // If we can't fetch the image, try to get a fresh URL
        const {
          data: { publicUrl: freshUrl },
        } = supabase.storage.from("cutoutly").getPublicUrl(savedFace.face_image_path)
        
        // Try one more time with the fresh URL
        try {
          const res = await fetch(freshUrl)
          if (!res.ok) {
            throw new Error("Fresh image URL not accessible")
          }
          const blob = await res.blob()
          const file = new File([blob], "saved-face.png", { type: "image/png" })
          onChange(file)
          setSavedFaceUrl(freshUrl)
          setIsFaceLocked(true)
          setPreview(freshUrl)
          setHasNewUpload(false)
        } catch (retryError) {
          console.error("Error fetching image with fresh URL:", retryError)
          // If we still can't fetch the image, clear the state
          if (onSavedFaceChange) {
            onSavedFaceChange(null)
          }
          localStorage.removeItem("cutoutly_saved_profile_face_id")
          setIsFaceLocked(false)
          setPreview(null)
          setSavedFaceUrl(null)
        }
      }
    } catch (error) {
      console.error("Error fetching saved face:", error)

      // Clear the state without treating it as an error
      if (onSavedFaceChange) {
        onSavedFaceChange(null)
      }
      localStorage.removeItem("cutoutly_saved_profile_face_id")
      setIsFaceLocked(false)
      setPreview(null)
      setSavedFaceUrl(null)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFaceLocked) return

    const file = e.target.files?.[0]
    if (!file) return

    onChange(file)
    setHasNewUpload(true)
    setIsFaceLocked(false)

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Clean up previous preview URL
    return () => URL.revokeObjectURL(objectUrl)
  }

  const handleDemoImage = async () => {
    if (isFaceLocked) return

    try {
      // Fetch the demo image
      const response = await fetch("/diverse-group-selfie.png")
      const blob = await response.blob()

      // Create a File object from the blob
      const file = new File([blob], "demo-image.png", { type: blob.type })

      // Set the file and preview
      onChange(file)
      setPreview("/diverse-group-selfie.png")
      setHasNewUpload(true)
      setIsFaceLocked(false)
    } catch (error) {
      console.error("Error loading demo image:", error)
    }
  }

  const handleSaveFace = async () => {
    if (!value || !preview) {
      toast({
        title: "No face to save",
        description: "Please upload a face image first.",
        variant: "destructive",
      })
      return
    }

    setIsSavingFace(true)

    try {
      // First, upload the image if it's not already uploaded
      let imagePath = preview

      // If the preview is a blob URL, we need to upload it
      if (preview.startsWith("blob:") || preview === "/diverse-group-selfie.png") {
        const formData = new FormData()
        formData.append("file", value)

        // Upload to a temporary location
        const uploadResponse = await fetch("/api/cutoutly/upload-profile-face", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload face image")
        }

        const uploadData = await uploadResponse.json()
        imagePath = uploadData.imagePath
      }

      // Now save the face reference
      const saveResponse = await fetch("/api/cutoutly/save-profile-face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imagePath }),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save face")
      }

      const saveData = await saveResponse.json()

      // Store the saved face ID in localStorage
      localStorage.setItem("cutoutly_saved_profile_face_id", saveData.savedFaceId)
      if (onSavedFaceChange) {
        onSavedFaceChange(saveData.savedFaceId)
      }
      setIsFaceLocked(true)
      setHasNewUpload(false)

      toast({
        title: "Face saved!",
        description: "Your face has been saved for future use.",
      })
    } catch (error) {
      console.error("Error saving face:", error)
      toast({
        title: "Failed to save face",
        description: "There was an error saving your face. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSavingFace(false)
    }
  }

  const handleUnlockFace = () => {
    setIsFaceLocked(false)
    setPreview(null)
    onChange(null)
    setHasNewUpload(true)
    // Remove from localStorage when unlocking
    localStorage.removeItem("cutoutly_saved_profile_face_id")
    if (onSavedFaceChange) {
      onSavedFaceChange(null)
    }
  }

  if (isLoadingFace || isLoadingPreview) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading saved face...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Face Lock Status */}
      {savedFaceId && (
        <div className="flex items-center justify-between p-3 bg-primary-light/20 rounded-lg border border-primary/30">
          <div className="flex items-center gap-2">
            {isFaceLocked ? <Lock className="h-4 w-4 text-primary" /> : <Unlock className="h-4 w-4 text-gray-500" />}
            <span className="text-sm font-medium">
              {isFaceLocked ? "Your face is saved" : "Face unlocked for this session"}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={isFaceLocked ? handleUnlockFace : handleSaveFace}
            disabled={isSavingFace}
          >
            {isFaceLocked ? "Unlock" : "Re-lock"}
          </Button>
        </div>
      )}

      {preview ? (
        <div className="relative aspect-square max-w-xs mx-auto">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-cover rounded-lg border-2 border-black"
          />
          {!isFaceLocked && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 bg-white"
              onClick={() => {
                onChange(null)
                setPreview(null)
                setHasNewUpload(false)
              }}
            >
              Change
            </Button>
          )}
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto text-primary"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
              <line x1="16" x2="22" y1="5" y2="5" />
              <line x1="19" x2="19" y1="2" y2="8" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">Drag and drop your selfie here, or click to browse</p>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-primary hover:bg-primary-light shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
            >
              Upload Image
            </Button>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              disabled={isFaceLocked}
            />
          </div>
        </Card>
      )}

      {!isFaceLocked && (
        <div className="text-center">
          <Button type="button" variant="link" onClick={handleDemoImage} className="text-primary">
            Or use a demo face
          </Button>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-2">
        <p>Recommended: Clear face photo with neutral background</p>
        <p>Max size: 5MB</p>
      </div>

      {/* Save Face Option */}
      {preview && !savedFaceId && !isFaceLocked && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-medium">Save my face for future avatars</h4>
              <p className="text-sm text-gray-500">Skip uploading your photo next time</p>
            </div>
            <Button type="button" onClick={handleSaveFace} disabled={isSavingFace} size="sm" className="ml-4">
              {isSavingFace ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save My Face"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end mt-4">
        <Button 
          type="button" 
          onClick={() => {
            if (hasNewUpload && !isFaceLocked) {
              toast({
                title: "Please save your face",
                description: "You need to save your face before proceeding to the next step.",
                variant: "destructive",
              })
              return
            }
            // Call the parent's onNext if provided
            if (onNext) {
              onNext()
            }
          }}
          disabled={hasNewUpload && !isFaceLocked}
        >
          Next
        </Button>
      </div>
    </div>
  )
} 