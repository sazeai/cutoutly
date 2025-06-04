"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Avatar {
  id: string
  outputUrl: string
  status: string
  created_at: string
}

interface AvatarGalleryProps {
  avatars: Avatar[]
  error: Error | null
}

export function AvatarGallery({ avatars, error }: AvatarGalleryProps) {
  const { toast } = useToast()

  const handleDelete = async (avatarId: string) => {
    try {
      const response = await fetch(`/api/cutoutly/avatars/${avatarId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete avatar")
      }

      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting avatar:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete avatar",
      })
    }
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>Failed to load avatars</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </Card>
    )
  }

  if (!avatars.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No avatars generated yet</p>
          <p className="text-sm">Generate your first avatar using the form above</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {avatars.map((avatar) => (
        <Card key={avatar.id} className="relative group">
          <div className="aspect-square relative">
            <img
              src={avatar.outputUrl}
              alt="Generated avatar"
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(avatar.id)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-2 text-center">
            <p className="text-xs text-muted-foreground">
              {new Date(avatar.created_at).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
} 