"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ResultPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [comic, setComic] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchComic() {
      try {
        // Fetch the comic data
        const { data, error } = await supabase.from("comics").select("*").eq("id", params.id).single()

        if (error) {
          console.error("Error fetching comic:", error)
          setError("Failed to load comic. Please try again.")
          setLoading(false)
          return
        }

        if (!data) {
          setError("Comic not found")
          setLoading(false)
          return
        }

        if (data.status === "failed") {
          setError(data.error_message || "Comic generation failed. Please try again.")
          setLoading(false)
          return
        }

        if (data.status !== "completed") {
          // If the comic is still processing, redirect back to the loading page
          router.push(`/loading/${params.id}`)
          return
        }

        setComic(data)
        setLoading(false)
      } catch (err) {
        console.error("Unexpected error:", err)
        setError("An unexpected error occurred. Please try again.")
        setLoading(false)
      }
    }

    fetchComic()
  }, [params.id, router])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your comic...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary-light">
        <Header currentPage="Result" />
        <div className="w-full max-w-4xl mx-auto mt-16 z-10 px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="text-xl mb-8">{error}</p>
          <Link href="/create">
            <Button className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-primary to-secondary border-none shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all">
              Try Again
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative pt-20 md:pt-0">
      {/* Cool Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-40 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-light opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent-light opacity-40 blur-3xl"></div>
      </div>

      <Header currentPage="Result" />

      <div className="w-full max-w-4xl mx-auto mt-8 md:mt-16 z-10 px-4 py-8">
        <div className="bg-white rounded-xl shadow-[8px_8px_0_rgba(0,0,0,1)] border-2 border-black p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">{comic.title || "Your Comic Strip"}</h1>
          <p className="text-gray-600 text-center mb-6">Based on your mood: "{comic.mood}"</p>

          <div className="relative aspect-square md:aspect-[4/3] w-full mb-8">
            {comic.comic_url && (
              <Image
                src={comic.comic_url || "/placeholder.svg?height=800&width=800&query=comic%20strip"}
                alt={`Comic: ${comic.mood || "Your mood"}`}
                fill
                className="object-contain rounded-lg"
                priority
                onError={(e) => {
                  console.error("Image failed to load:", e)
                  // Fallback to a placeholder if the image fails to load
                  e.currentTarget.src = "/comic-strip.png"
                }}
              />
            )}
          </div>

          {/* Panel descriptions */}
          {comic.panel_descriptions && comic.panel_descriptions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Comic Panels:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(comic.panel_descriptions)
                  ? // Handle new format (array of objects with description and caption)
                    comic.panel_descriptions.map((panel: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="font-medium">Panel {index + 1}:</p>
                        <p className="text-gray-700 mb-2">{typeof panel === "object" ? panel.description : panel}</p>
                        {typeof panel === "object" && panel.caption && (
                          <p className="text-primary font-bold italic">"{panel.caption}"</p>
                        )}
                      </div>
                    ))
                  : // Handle old format (array of strings)
                    typeof comic.panel_descriptions === "string"
                    ? [comic.panel_descriptions].map((description: string, index: number) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <p className="font-medium">Panel {index + 1}:</p>
                          <p className="text-gray-700">{description}</p>
                        </div>
                      ))
                    : null}
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button
                variant="outline"
                className="w-full md:w-auto border-2 border-primary hover:bg-primary-light shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
              >
                Create Another
              </Button>
            </Link>
            <Link href="/gallery">
              <Button
                variant="outline"
                className="w-full md:w-auto border-2 border-primary hover:bg-primary-light shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
              >
                View Gallery
              </Button>
            </Link>
            <Button
              onClick={() => {
                // Download the image
                if (comic.comic_url) {
                  const link = document.createElement("a")
                  link.href = comic.comic_url
                  link.download = `comic-${comic.title || "strip"}.png`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }
              }}
              className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary border-none shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
            >
              Download Comic
            </Button>
          </div>

          {/* Social sharing preview */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-bold mb-4">Share Preview:</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-bold">You</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <p className="text-gray-700">"{comic.title || comic.mood}" #ComicVibe</p>
              <div className="mt-2 aspect-[4/3] w-full max-w-xs bg-gray-200 rounded-lg relative overflow-hidden">
                {comic.comic_url && (
                  <Image
                    src={comic.comic_url || "/placeholder.svg"}
                    alt="Comic preview"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
