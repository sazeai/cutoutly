"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const useCases = [
  {
    emoji: "🔥",
    title: "Launch Teasers",
    description: 'Character pointing to a "Coming soon" or "Try it now" bubble',
    image: "/cartoon-coming-soon.png",
    color: "from-rose-500 to-orange-500",
    category: "Marketing",
  },
  {
    emoji: "🧠",
    title: "Pitch Deck Slides",
    description: "Founder's cartoon holding a mockup or pointing at metrics",
    image: "/cartoon-founder-growth.png",
    color: "from-violet-500 to-purple-500",
    category: "Business",
  },
  {
    emoji: "🪄",
    title: "Landing Page Visuals",
    description: 'Cutout with "Start your free trial" or "No credit card needed"',
    image: "/cartoon-landing-page.png",
    color: "from-primary to-teal-500",
    category: "Web Design",
  },
  {
    emoji: "🗣",
    title: "Twitter Promo Posts",
    description: "Expressive cartoon with custom quote in a speech bubble",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-blue-500 to-sky-500",
    category: "Social Media",
  },
  {
    emoji: "🧩",
    title: "Product Hunt Assets",
    description: '"We\'re live on PH!" character sticker with upvote button',
    image: "/placeholder.svg?height=300&width=400",
    color: "from-red-500 to-rose-500",
    category: "Marketing",
  },
  {
    emoji: "📝",
    title: "Newsletter CTA blocks",
    description: 'Cartoon saying "Subscribe for weekly growth tips!"',
    image: "/placeholder.svg?height=300&width=400",
    color: "from-amber-500 to-yellow-500",
    category: "Email Marketing",
  },
  {
    emoji: "🧑‍🏫",
    title: "Online Course Thumbnails",
    description: 'Instructor avatar with "Let\'s learn!" pose',
    image: "/placeholder.svg?height=300&width=400",
    color: "from-emerald-500 to-green-500",
    category: "Education",
  },
  {
    emoji: "🧰",
    title: "Figma / Notion Assets",
    description: "Drag-and-drop PNGs into your product mockups or docs",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-fuchsia-500 to-pink-500",
    category: "Design Tools",
  },
  {
    emoji: "🛒",
    title: "Gumroad / Lemon Squeezy",
    description: "Personal branding on product cards",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-cyan-500 to-blue-500",
    category: "E-commerce",
  },
  {
    emoji: "📣",
    title: "Ad Creative",
    description: "Use in Facebook/Twitter/LinkedIn ads with real faces turned cartoons",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-secondary to-amber-500",
    category: "Advertising",
  },
]

const categories = ["All", "Marketing", "Business", "Social Media", "Design Tools", "E-commerce"]

export function UseCasesSection() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentSlide, setCurrentSlide] = useState(0)

  const filteredUseCases =
    activeCategory === "All" ? useCases : useCases.filter((useCase) => useCase.category === activeCategory)

  const itemsPerSlide = 6
  const totalSlides = Math.ceil(filteredUseCases.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide
    return filteredUseCases.slice(startIndex, startIndex + itemsPerSlide)
  }

  return (
    <section className="w-full py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases & Templates</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          From pitch decks to social media posts, discover how creators use Cutoutly to make their content stand out
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category)
              setCurrentSlide(0)
            }}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeCategory === category
                ? "bg-primary text-white border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)]"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Use Cases Grid */}
      <div className="relative">
        <motion.div
          key={`${activeCategory}-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {getCurrentItems().map((useCase, index) => (
            <div
              key={`${useCase.title}-${index}`}
              className="group border-2 border-black rounded-xl bg-white p-6 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white mr-3 bg-gradient-to-br ${useCase.color}`}
                >
                  <span className="text-2xl">{useCase.emoji}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">{useCase.title}</h3>
                  <span className="text-sm text-gray-500">{useCase.category}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4 text-sm leading-relaxed">{useCase.description}</p>

              {/* Preview Image */}
              <div className="relative h-32 rounded-lg overflow-hidden border border-gray-200 mb-4">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

            </div>
          ))}
        </motion.div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-x-5 hover:-translate-y-1/2 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_rgba(0,0,0,1)] hover:translate-x-5 hover:-translate-y-1/2 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-primary" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">Ready to create your own cartoon cutout?</p>
        <a
          href="/create"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-[0_4px_0_rgba(0,0,0,1)] hover:shadow-[0_2px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
        >
          Start Creating Now
          <ChevronRight className="ml-2 w-4 h-4" />
        </a>
      </div>
    </section>
  )
}
