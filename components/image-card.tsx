"use client"

import { useState } from "react"
import Image from "next/image"
import { useImages } from "@/hooks/use-images"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Download, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface ImageCardProps {
  image: {
    id: string
    output_image_path: string
    created_at: string
  }
  type: "generated" | "saved"
  userId: string
}

export function ImageCard({ image, type, userId }: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteImage } = useImages({
    userId,
    tableName: type === "generated" ? "cutoutly_cartoons" : "cutoutly_avatars",
  })

  const imageUrl = image.output_image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${
        type === "generated" ? "cartoons" : "avatars"
      }/${image.output_image_path}`
    : ""

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteImage(image.id)
      toast.success("Image deleted successfully")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `image-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    }
  }

  if (!imageUrl) return null

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={imageUrl}
            alt="Generated image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDownload}
          title="Download"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
} 