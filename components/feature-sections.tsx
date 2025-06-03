"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, User, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeatureSections() {
  return (
    <div className="w-full">
      {/* Cartoon PNG Creator Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <div className="text-2xl">🧑‍🎤</div>
                <span className="font-bold text-sm">Cartoon PNG Creator</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">Turn any photo into a</span>
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  cartoon cutout
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Turn any photo into a cartoon cutout with a transparent background. Add props, poses, speech bubbles,
                and more. Perfect for social, business, or fun!
              </p>

              <Button
                asChild
                size="lg"
                className="bg-primary text-white font-bold text-lg px-8 py-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Link href="/png-creator">
                  Try PNG Creator
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎭", label: "Add Props & Poses" },
                  { icon: "💬", label: "Speech Bubbles" },
                  { icon: "📱", label: "Social Ready" },
                  { icon: "💼", label: "Business Use" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=Cartoon+PNG+Examples"
                    alt="Cartoon PNG examples"
                    width={500}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary border-2 border-black rounded-2xl p-3 shadow-[6px_6px_0_rgba(0,0,0,1)] rotate-6">
                <span className="text-white font-bold text-sm">PNG</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-3">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Profile Maker Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Visual - Left side for this section */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 to-primary/20">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=AI+Profile+Examples"
                    alt="AI Profile examples"
                    width={500}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-secondary border-2 border-black rounded-2xl p-3 shadow-[6px_6px_0_rgba(0,0,0,1)] -rotate-6">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] rotate-3">
                <span className="text-2xl">✨</span>
              </div>
            </div>

            {/* Content - Right side for this section */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <span className="text-2xl">✨</span>
                <span className="font-bold text-sm">AI Profile Maker</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">Generate stunning</span>
                <span className="block bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  AI profile pictures
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Generate stunning AI profile pictures in dozens of styles. Choose your expression, outfit, and more.
                Great for LinkedIn, social media, or just for fun!
              </p>

              <Button
                asChild
                size="lg"
                className="bg-secondary text-white font-bold text-lg px-8 py-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Link href="/profile-maker">
                  Try Profile Maker
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎭", label: "Dozens of Styles" },
                  { icon: "😊", label: "Custom Expression" },
                  { icon: "👔", label: "Choose Outfit" },
                  { icon: "💼", label: "LinkedIn Ready" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom PNG Generator Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-full shadow-[4px_4px_0_rgba(0,0,0,1)]">
                <Wand2 className="w-4 h-4 text-primary" />
                <span className="font-bold text-sm">Custom PNG Generator</span>
              </div>

              <h2 className="text-4xl lg:text-6xl font-black leading-tight">
                <span className="block text-gray-900">Describe anything,</span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  get a PNG
                </span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Describe anything you want objects, scenes, icons, memes, fantasy art, and more. Our AI will turn your
                prompt into a transparent PNG, ready to use anywhere.
              </p>

              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg px-8 py-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Link href="/custom-prompt">
                  Try Custom Prompt
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🎯", label: "Any Object" },
                  { icon: "🌟", label: "Fantasy Art" },
                  { icon: "😂", label: "Memes & Icons" },
                  { icon: "🎨", label: "Transparent PNG" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium text-gray-700">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
                  <Image
                    src="/placeholder.svg?height=400&width=500&text=Custom+PNG+Examples"
                    alt="Custom PNG examples"
                    width={500}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-secondary border-2 border-black rounded-2xl p-3 shadow-[6px_6px_0_rgba(0,0,0,1)] rotate-6">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-black rounded-xl p-3 shadow-[4px_4px_0_rgba(0,0,0,1)] -rotate-3">
                <span className="text-2xl">🪄</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
