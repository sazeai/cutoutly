"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"

const useCases = [
  {
    emoji: "🔥",
    title: "Launch Teasers",
    description: 'Character pointing to a "Coming soon" or "Try it now" bubble',
    image: "/cartoon-coming-soon.png",
    color: "from-rose-500 to-orange-500",
  },
  {
    emoji: "🧠",
    title: "Pitch Deck Slides",
    description: "Founder's cartoon holding a mockup or pointing at metrics",
    image: "/cartoon-founder-growth.png",
    color: "from-violet-500 to-purple-500",
  },
  {
    emoji: "🪄",
    title: "Landing Page Visuals",
    description: 'Cutout with "Start your free trial" or "No credit card needed"',
    image: "/cartoon-landing-page.png",
    color: "from-primary to-teal-500",
  },
  {
    emoji: "🗣",
    title: "Twitter Promo Posts",
    description: "Expressive cartoon with custom quote in a speech bubble",
    image: "/placeholder.svg?height=300&width=400&query=cartoon character with twitter post",
    color: "from-blue-500 to-sky-500",
  },
  {
    emoji: "🧩",
    title: "Product Hunt Assets",
    description: '"We\'re live on PH!" character sticker with upvote button',
    image: "/placeholder.svg?height=300&width=400&query=cartoon character with product hunt logo",
    color: "from-red-500 to-rose-500",
  },
  {
    emoji: "📝",
    title: "Newsletter CTA blocks",
    description: 'Cartoon saying "Subscribe for weekly growth tips!"',
    image: "/placeholder.svg?height=300&width=400&query=cartoon character with newsletter signup",
    color: "from-amber-500 to-yellow-500",
  },
  {
    emoji: "🧑‍🏫",
    title: "Online Course Thumbnails",
    description: 'Instructor avatar with "Let\'s learn!" pose',
    image: "/placeholder.svg?height=300&width=400&query=cartoon instructor teaching online course",
    color: "from-emerald-500 to-green-500",
  },
  {
    emoji: "🧰",
    title: "Figma / Notion Assets",
    description: "Drag-and-drop PNGs into your product mockups or docs",
    image: "/placeholder.svg?height=300&width=400&query=cartoon character in figma design",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    emoji: "🛒",
    title: "Gumroad / Lemon Squeezy",
    description: "Personal branding on product cards",
    image: "/placeholder.svg?height=300&width=400&query=cartoon character on product sales page",
    color: "from-cyan-500 to-blue-500",
  },
  {
    emoji: "📣",
    title: "Ad Creative",
    description: "Use in Facebook/Twitter/LinkedIn ads with real faces turned cartoons",
    image: "/placeholder.svg?height=300&width=400&query=cartoon character in social media ad",
    color: "from-secondary to-amber-500",
  },
]

export function UseCasesSection() {
  const [activeCase, setActiveCase] = useState(0)
  const [hoveredCase, setHoveredCase] = useState<number | null>(null)

  return (
    <section className="w-full py-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Use Cases</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Interactive list */}
        <div className="lg:col-span-1 space-y-2">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-xl transition-all duration-300 overflow-hidden ${
                activeCase === index
                  ? "border-2 border-black bg-white shadow-[5px_5px_0_rgba(0,0,0,1)]"
                  : "border border-gray-200 bg-white/80 hover:border-gray-300"
              }`}
              onClick={() => setActiveCase(index)}
              onMouseEnter={() => setHoveredCase(index)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              <div className="flex items-center p-3 md:p-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white mr-3 bg-gradient-to-br ${useCase.color}`}
                >
                  <span className="text-xl">{useCase.emoji}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold">{useCase.title}</h3>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeCase === index || hoveredCase === index
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0"
                  }`}
                />
              </div>

              {/* Animated underline */}
              {(activeCase === index || hoveredCase === index) && (
                <motion.div
                  className={`h-1 bg-gradient-to-r ${useCase.color}`}
                  layoutId="activeUnderline"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right side - Showcase */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-black rounded-xl bg-white p-6 md:p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Left side - Text content */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 bg-gradient-to-br ${useCases[activeCase].color}`}
                    >
                      <span className="text-2xl">{useCases[activeCase].emoji}</span>
                    </div>
                    <h3 className="text-2xl font-bold">{useCases[activeCase].title}</h3>
                  </div>

                  <p className="text-lg mb-6">{useCases[activeCase].description}</p>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <p>Upload your selfie and select this use case template</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <p>Customize your pose, expression, and text</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <p>Download as transparent PNG and use anywhere</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href="/create"
                    className={`inline-flex items-center px-4 py-2 rounded-full text-white font-bold bg-gradient-to-r ${
                      useCases[activeCase].color
                    } shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all`}
                  >
                    Try this template
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right side - Image preview */}
              <div className="relative rounded-lg overflow-hidden border-2 border-black h-64 md:h-full">
                <div className="absolute inset-0 bg-gray-100 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Image
                  src={useCases[activeCase].image || "/placeholder.svg"}
                  alt={useCases[activeCase].title}
                  fill
                  className="object-cover"
                  onLoad={(e) => {
                    // Hide loading spinner when image loads
                    const target = e.target as HTMLImageElement
                    target.parentElement?.querySelector("div")?.classList.add("hidden")
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile indicator dots */}
      <div className="flex justify-center mt-6 lg:hidden">
        {useCases.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${activeCase === index ? "bg-primary" : "bg-gray-300"}`}
            onClick={() => setActiveCase(index)}
          />
        ))}
      </div>
    </section>
  )
}
