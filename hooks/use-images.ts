import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"

interface Image {
  id: string
  url: string
  createdAt: string
}

interface UseImagesOptions {
  userId: string | undefined
  tableName: "generated_images" | "saved_images" | "cutoutly_cartoons" | "cutoutly_avatars"
}

export function useImages({ userId, tableName }: UseImagesOptions) {
  const queryClient = useQueryClient()

  const { data: images, isLoading } = useQuery({
    queryKey: [tableName, userId],
    queryFn: async () => {
      if (!userId) return []
      const supabase = createClient()
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })

  const deleteImage = useMutation({
    mutationFn: async (imageId: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", imageId)
        .eq("user_id", userId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName, userId] })
    },
  })

  return {
    images,
    isLoading,
    deleteImage: deleteImage.mutate,
  }
}

interface UseSavedFaceOptions {
  userId: string | undefined
  tableName: "generated_images" | "saved_images" | "cutoutly_cartoons" | "cutoutly_avatars"
  storageKey: string
}

export function useSavedFace({ userId, tableName, storageKey }: UseSavedFaceOptions) {
  const queryClient = useQueryClient()
  const { data: savedFaceId, isLoading } = useQuery({
    queryKey: [tableName, userId],
    queryFn: async () => {
      const supabase = createClient()
      
      // Try to get saved face ID from localStorage first
      const storedFaceId = localStorage.getItem(storageKey)

      if (storedFaceId) {
        // Verify the saved face exists in the database
        const { data: savedFace } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", storedFaceId)
          .single()

        if (savedFace) {
          return storedFaceId
        }
      }

      // If not found or no localStorage item, get the most recent saved face
      const { data: recentFace } = await supabase
        .from(tableName)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (recentFace) {
        localStorage.setItem(storageKey, recentFace.id)
        return recentFace.id
      }

      localStorage.removeItem(storageKey)
      return null
    },
  })

  const updateSavedFace = useMutation({
    mutationFn: async (faceId: string | null) => {
      if (faceId) {
        localStorage.setItem(storageKey, faceId)
      } else {
        localStorage.removeItem(storageKey)
      }
      return faceId
    },
    onSuccess: (newFaceId) => {
      queryClient.setQueryData([tableName, userId], newFaceId)
    },
  })

  return {
    savedFaceId,
    isLoading,
    updateSavedFace: updateSavedFace.mutate,
  }
} 