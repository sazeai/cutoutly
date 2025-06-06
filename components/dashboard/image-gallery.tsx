"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ImageGalleryProps {
  images: Array<{
    id: string
    url: string
    createdAt: string
  }>
  isGenerating: boolean
  pendingImageId?: string | null
  onImageDeleted?: (imageId: string) => void
}

export function ImageGallery({ images, isGenerating, pendingImageId, onImageDeleted }: ImageGalleryProps) {
  const [deletingImages, setDeletingImages] = useState<Set<string>>(new Set())
  const [downloadingImages, setDownloadingImages] = useState<Set<string>>(new Set())
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const handleImageLoad = useCallback((id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id))
  }, [])

  const handleDownload = async (image: { id: string; url: string }) => {
    if (downloadingImages.has(image.id)) return

    try {
      setDownloadingImages((prev) => new Set(prev).add(image.id))

      // Fetch the image as a blob
      const response = await fetch(image.url)
      const blob = await response.blob()

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob)

      // Create a link element
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = `cutoutly-${image.id}.png`

      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the blob URL
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl)
      }, 100)
    } catch (error) {
      console.error("Error downloading image:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(image.id)
        return newSet
      })
    }
  }

  const handleDelete = useCallback(async (imageId: string) => {
    if (deletingImages.has(imageId)) return

    try {
      setDeletingImages((prev) => new Set(prev).add(imageId))

      const response = await fetch(`/api/cutoutly/delete-image/${imageId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete image")
      }

      // Call the callback to update the parent component
      if (onImageDeleted) {
        onImageDeleted(imageId)
      }

      // Remove from loaded images set
      setLoadedImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })

      toast({
        title: "Image deleted",
        description: "Your cartoon has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeletingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }, [deletingImages, onImageDeleted, toast])

  return (
    <Card className="border-2 border-black rounded-xl bg-white p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Cartoons</h2>
        <div className="text-sm text-gray-500">{images.length} images</div>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Loading placeholder if generating */}
        {isGenerating && (
          <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin mx-auto mb-2 text-primary border-2 border-primary border-t-transparent rounded-full" />
              <p className="text-sm text-gray-500">Generating your cartoon...</p>
            </div>
          </div>
        )}

        {/* Generated images */}
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square border-2 border-black rounded-lg overflow-hidden group"
            style={{
              background: `
                linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            {/* Loading Skeleton */}
            {!loadedImages.has(image.id) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="h-8 w-8 animate-spin text-primary border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            <Image
              src={image.url || "/placeholder.svg"}
              alt={`Generated cartoon`}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={`object-contain p-2 transition-opacity duration-300 ${
                loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => handleImageLoad(image.id)}
              priority={false}
            />

            {/* Delete button - Top left corner */}
            <Button
              onClick={() => handleDelete(image.id)}
              disabled={deletingImages.has(image.id)}
              className="absolute top-2 left-2 w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white border-2 border-black rounded-lg shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              variant="destructive"
            >
              {deletingImages.has(image.id) ? (
                <div className="h-3 w-3 animate-spin border border-white border-t-transparent rounded-full" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>

            {/* Download button - Top right corner */}
            <Button
              onClick={() => handleDownload(image)}
              disabled={downloadingImages.has(image.id)}
              className="absolute top-2 right-2 w-8 h-8 p-0 bg-primary hover:bg-primary/90 text-white border-2 border-black rounded-lg shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
            >
              {downloadingImages.has(image.id) ? (
                <div className="h-3 w-3 animate-spin border border-white border-t-transparent rounded-full" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {images.length === 0 && !isGenerating && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-lg font-medium mb-2">No cartoons yet</h3>
          <p className="text-gray-500 mb-4">Create your first cartoon by filling out the form</p>
        </div>
      )}
    </Card>
  )
}
