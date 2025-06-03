"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AutoImageSwiper } from "./auto-image-swiper"

export function StunningHero() {
  // Example images for the swiper - replace with your actual AI-generated examples
  const exampleImages = [
    "/placeholder.svg?height=600&width=450&text=Cartoon+1",
    "/placeholder.svg?height=600&width=450&text=Cartoon+2",
    "/placeholder.svg?height=600&width=450&text=Cartoon+3",
    "/placeholder.svg?height=600&width=450&text=Cartoon+4",
    "/placeholder.svg?height=600&width=450&text=Cartoon+5",
  ]

  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/5 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        {/* Grid Pattern */}
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] transition-all">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm">AI-Powered PNG Generator</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 sm:text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="block text-gray-900">Upload your face.</span>
                <span className="block text-gray-900">Or don't.</span>
                <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                  We'll still make you a flamingo with sunglasses.
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-2xl">
              Cartoon cutouts, AI profile pics, or custom PNGs from your photo or your prompt — it's your imagination,
              we just press generate.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
  asChild
  size="lg"
  className="bg-black text-white font-bold text-lg px-8 py-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_rgba(255,255,255,1)] hover:shadow-[8px_8px_0_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
>
  <Link href="/create">
    Start Creating Magic
    <ArrowRight className="ml-2 w-5 h-5" />
  </Link>
</Button>


              <Button
                variant="outline"
                size="lg"
                className="font-bold text-lg px-8 py-6 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                asChild
              >
                <Link href="/examples">View Examples</Link>
              </Button>
            </div>

            {/* Social Proof - Stacked Avatars */}
            <div className="flex items-center gap-4 pt-8">
              <div className="flex items-center">
                {/* Stacked Avatar Images */}
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm"
                    >
                      <Image
                        src={`/placeholder.svg?height=40&width=40&text=${i}`}
                        alt={`User ${i}`}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-800 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    +12
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">Loved by creators</span>
              </div>
            </div>
          </div>

          {/* Right Column - Auto Image Swiper with Floating Elements */}
          <div className="relative mx-auto lg:mx-0 w-full h-[650px] lg:h-[700px]">
            {/* Main card with swiper */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <AutoImageSwiper
                images={exampleImages}
                cardWidth={450}
                cardHeight={600}
                autoPlayInterval={3000}
                className="mx-auto"
              />
            </div>

            {/* Floating Elements - Positioned with enough space to be fully visible */}
            <div className="absolute top-5 right-5 bg-white border-2 border-black rounded-2xl p-4 shadow-[6px_6px_0_rgba(0,0,0,1)] rotate-3 z-20">
              <div className="flex items-center gap-2">
                <div className="text-xl">🎨</div>
                <div className="text-sm font-bold">AI Powered</div>
              </div>
            </div>

            <div className="absolute bottom-5 left-5 bg-gradient-to-r from-primary to-secondary border-2 border-black rounded-2xl p-4 shadow-[6px_6px_0_rgba(0,0,0,1)] -rotate-3 z-20">
              <div className="text-white font-bold text-lg">New</div>
              <div className="text-white text-sm">Profile Maker</div>
            </div>

            <div className="absolute top-1/2 right-0 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] rotate-6 z-20">
              <div className="text-2xl">⚡</div>
            </div>

            <div className="absolute top-1/4 left-0 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-12 z-20">
              <div className="text-2xl">🦩</div>
            </div>
          </div>
        </div>
      </div>

 
    </section>
  )
}
