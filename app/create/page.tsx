"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { generateComic } from "../actions/generate-comic"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"

export default function CreatePage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Form state
  const [mood, setMood] = useState("")
  const [persona, setPersona] = useState("")
  const [vibe, setVibe] = useState("")
  const [style, setStyle] = useState("Comic Strip")
  const [layout, setLayout] = useState("square")
  const [size, setSize] = useState("1024x1024") // Default to square

  // Check for user authentication
  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Check for error in URL
  useEffect(() => {
    const error = searchParams.get("error")
    if (error === "generation-failed") {
      toast({
        title: "Generation failed",
        description: "There was an error generating your comic. Please try again.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Store the file directly
    setUploadedImage(file)

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setUploadedImagePreview(previewUrl)

    toast({
      title: "Image selected",
      description: "Your image has been selected successfully!",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedImage) {
      toast({
        title: "Missing image",
        description: "Please upload an image first.",
        variant: "destructive",
      })
      return
    }

    if (!mood) {
      toast({
        title: "Missing mood",
        description: "Please describe your mood.",
        variant: "destructive",
      })
      return
    }

    if (!persona) {
      toast({
        title: "Missing persona",
        description: "Please select what best describes you.",
        variant: "destructive",
      })
      return
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a comic.",
        variant: "destructive",
      })
      router.push("/login?redirect=/create")
      return
    }

    try {
      setIsGenerating(true)

      const result = await generateComic({
        image: uploadedImage,
        mood,
        persona,
        vibe,
        style,
        layout,
        size, // Pass the selected size
      })

      if (result.success && result.comicId) {
        // Redirect to the loading page with the comic ID
        router.push(`/loading/${result.comicId}`)
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

  const handleDemoImage = async () => {
    try {
      // Fetch the demo image
      const response = await fetch("/diverse-group-selfie.png")
      const blob = await response.blob()

      // Create a File object from the blob
      const file = new File([blob], "demo-image.png", { type: blob.type })

      // Set the file and preview
      setUploadedImage(file)
      setUploadedImagePreview("/diverse-group-selfie.png")

      toast({
        title: "Demo image selected",
        description: "Using the demo image for your comic strip.",
      })
    } catch (error) {
      toast({
        title: "Error loading demo image",
        description: "Failed to load the demo image.",
        variant: "destructive",
      })
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (uploadedImagePreview && !uploadedImagePreview.startsWith("/")) {
        URL.revokeObjectURL(uploadedImagePreview)
      }
    }
  }, [uploadedImagePreview])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative pt-20 md:pt-0">
      {/* Cool Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-light opacity-40 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-light opacity-40 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-accent-light opacity-40 blur-3xl"></div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-1/4 text-5xl opacity-10">✨</div>
        <div className="absolute bottom-40 left-1/4 text-5xl opacity-10">🎨</div>
        <div className="absolute top-1/3 right-20 text-5xl opacity-10">💫</div>
      </div>

      <Header currentPage="Creating Comic" />

      <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto mt-8 md:mt-16 z-10 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Main Form */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">Turn your mood into a 3-panel cartoon strip</h1>
            <p className="text-gray-600">
              Upload your selfie, tell us how you're feeling, and get a comic strip that screams YOU.
            </p>

            {/* Step 1 & 2 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Step 1: Upload Selfie</h2>
                <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center bg-white">
                  {uploadedImagePreview ? (
                    <div className="mb-4 relative">
                      <Image
                        src={uploadedImagePreview || "/placeholder.svg"}
                        alt="Uploaded selfie"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white"
                        onClick={() => {
                          setUploadedImage(null)
                          if (uploadedImagePreview && !uploadedImagePreview.startsWith("/")) {
                            URL.revokeObjectURL(uploadedImagePreview)
                          }
                          setUploadedImagePreview(null)
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <>
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
                          onChange={handleImageUpload}
                        />
                      </div>
                    </>
                  )}
                  <p className="mt-4 text-sm text-gray-400">
                    Or{" "}
                    <button type="button" className="text-primary underline" onClick={handleDemoImage}>
                      try with demo face
                    </button>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Step 2: Describe Your Mood</h2>
                <Textarea
                  placeholder="Example: 'Shipping like hell', 'Investor ghosted again', 'Feeling cracked today'"
                  className="border-2 border-primary shadow-[4px_4px_0_rgba(0,0,0,1)] bg-white"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Options */}
          <div className="space-y-6">
            <div className="border-2 border-black rounded-xl p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] bg-white">
              {/* Step 3 & 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">Step 3: What Best Describes You?</h2>
                  <Select value={persona} onValueChange={setPersona}>
                    <SelectTrigger className="border-2 border-primary shadow-[4px_4px_0_rgba(0,0,0,1)]">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">Founder</SelectItem>
                      <SelectItem value="coder">Coder</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="corporate">Corporate slave</SelectItem>
                      <SelectItem value="custom">Add your own...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Step 4: (Optional) Comic Vibe</h2>
                  <Input
                    placeholder="From burnout to launch party..."
                    className="border-2 border-primary shadow-[4px_4px_0_rgba(0,0,0,1)]"
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value)}
                  />
                </div>
              </div>

              {/* Step 5: Choose Comic Style */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Step 5: Choose Comic Style</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {["Comic Strip", "Pixar Style", "Sketch", "Cyberpunk", "Cute Bubble"].map((styleOption) => (
                    <div
                      key={styleOption}
                      className={`border-2 ${style === styleOption ? "border-secondary bg-secondary-light" : "border-primary"} rounded-lg p-2 text-center cursor-pointer hover:bg-primary-light shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      onClick={() => setStyle(styleOption)}
                    >
                      <div className="aspect-square bg-gray-200 rounded-md mb-2">
                        <Image
                          src={`/abstract-geometric-shapes.png?height=80&width=80&query=${styleOption} style`}
                          alt={styleOption}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <p className="text-xs font-medium">{styleOption}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 6: Choose Output Layout */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Step 6: Choose Output Layout</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    {
                      id: "square",
                      name: "Grid Layout",
                      preview: (
                        <div className="grid grid-cols-3 gap-1 w-full">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="aspect-square bg-primary-light rounded-md"></div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      id: "vertical",
                      name: "Vertical Panels",
                      preview: (
                        <div className="flex flex-col gap-1 h-full">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-full h-6 bg-primary-light rounded-md"></div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      id: "horizontal",
                      name: "Horizontal Panels",
                      preview: (
                        <div className="flex gap-1 w-full">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex-1 h-full bg-primary-light rounded-md"></div>
                          ))}
                        </div>
                      ),
                    },
                    {
                      id: "carousel",
                      name: "4-Panel Strip",
                      preview: (
                        <div className="flex gap-1 w-full">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex-1 h-full bg-primary-light rounded-md"></div>
                          ))}
                        </div>
                      ),
                    },
                  ].map((layoutOption) => (
                    <div
                      key={layoutOption.id}
                      className={`border-2 ${layout === layoutOption.id ? "border-secondary bg-secondary-light" : "border-primary"} rounded-lg p-2 cursor-pointer hover:bg-primary-light shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      onClick={() => setLayout(layoutOption.id)}
                    >
                      <div className="aspect-square mb-2 flex items-center justify-center">{layoutOption.preview}</div>
                      <p className="text-xs font-medium text-center">{layoutOption.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 7: Choose Image Size */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Step 7: Choose Image Size</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    {
                      id: "auto",
                      name: "Auto",
                      description: "Let AI decide",
                      preview: (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <path d="M21 3H3v18h18V3z" />
                            <path d="M21 11H3" />
                            <path d="M11 3v18" />
                          </svg>
                        </div>
                      ),
                    },
                    {
                      id: "1024x1024",
                      name: "Square",
                      description: "1024×1024",
                      preview: <div className="w-full aspect-square bg-primary-light rounded-md"></div>,
                    },
                    {
                      id: "1536x1024",
                      name: "Landscape",
                      description: "1536×1024",
                      preview: <div className="w-full h-8 bg-primary-light rounded-md"></div>,
                    },
                    {
                      id: "1024x1536",
                      name: "Portrait",
                      description: "1024×1536",
                      preview: <div className="h-full w-8 mx-auto bg-primary-light rounded-md"></div>,
                    },
                  ].map((sizeOption) => (
                    <div
                      key={sizeOption.id}
                      className={`border-2 ${size === sizeOption.id ? "border-secondary bg-secondary-light" : "border-primary"} rounded-lg p-2 cursor-pointer hover:bg-primary-light shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
                      onClick={() => setSize(sizeOption.id)}
                    >
                      <div className="aspect-square mb-2 flex items-center justify-center">{sizeOption.preview}</div>
                      <p className="text-xs font-medium text-center">{sizeOption.name}</p>
                      <p className="text-xs text-gray-500 text-center">{sizeOption.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <Button
                type="submit"
                className="w-full py-4 md:py-6 text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary border-none shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
                disabled={isGenerating || !uploadedImage || !mood || !persona}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Your Comic Strip...
                  </>
                ) : (
                  "Create My Comic Strip"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </main>
  )
}
