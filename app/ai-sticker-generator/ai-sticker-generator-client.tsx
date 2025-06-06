"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Download, Palette, Star, Check, Users, Rocket, ChevronDown, ChevronUp } from "lucide-react"

export default function AIStickerGeneratorClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "What types of stickers can I generate with AI?",
      answer:
        "You can create any type of sticker including header stickers (SOLD OUT, NEW, etc.), decorative elements (stars, arrows, ribbons), emotes and reactions, UI components, icons, and themed sticker packs in styles like kawaii, minimalist, 3D, hand-drawn, and more.",
    },
    {
      question: "Do the generated stickers have transparent backgrounds?",
      answer:
        "Yes! Every PNG sticker generated comes with a clean transparent background, making them perfect for use in any design, website, social media post, or application without worrying about background colors.",
    },
    {
      question: "Can I use these stickers for commercial purposes?",
      answer:
        "All generated stickers come with a commercial license, meaning you can use them for personal projects, sell them on platforms like Etsy, use them in client work, or include them in your business materials without any restrictions.",
    },
    {
      question: "How long does it take to generate a sticker?",
      answer:
        "Our AI generates high-quality stickers in just a few seconds. Simply describe what you want, choose your preferred style, and download your professional PNG sticker almost instantly.",
    },
    {
      question: "What resolution are the generated stickers?",
      answer:
        "All stickers are generated in high resolution (typically 1024x1024 pixels or higher) ensuring they look crisp and professional whether used in small social media posts or large print materials.",
    },
    {
      question: "Can I generate multiple variations of the same sticker?",
      answer:
        "Yes! You can generate multiple variations of your design in one go, perfect for A/B testing different styles, colors, or approaches. This helps you find the perfect sticker for your needs.",
    },
    {
      question: "What art styles are available?",
      answer:
        "We support a wide range of art styles including kawaii, minimalist, 3D render, hand-drawn, pixel art, watercolor, neon, vintage, cartoon, realistic, and many more. Just describe the style you want in your prompt.",
    },
    {
      question: "Do I need design skills to use this?",
      answer:
        "Not at all! Our AI sticker generator is designed for everyone. Simply describe what you want in plain English, and our AI will create professional-quality stickers. No design experience or software knowledge required.",
    },
  ]
  return (
    <main className="flex relative flex-col items-center justify-start bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative pt-32 md:pt-36">
      {/* Cool Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <Header currentPage="AI Sticker Generator" />

 
        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto z-10 px-4 flex items-center py-12 md:py-20 justify-center relative overflow-hidden">
        <div className="text-center w-full">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-3xl mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
            Create Stunning PNG Stickers
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              with Just a Prompt
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-700">
            Create professional stickers, emotes, UI assets, and icons instantly. Just describe what you want, and get
            studio-quality PNGs with transparent backgrounds ready for any project.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Transparent Background</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>High Resolution</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Instant Download</span>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Types Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Create Any Type of Visual Asset</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From header stickers to custom emotes, turn your ideas into professional assets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Stickers & Headers */}
          <div className="border-2 border-black rounded-3xl bg-white p-8 bg-gradient-to-br from-pink-50 to-rose-50 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center">
                <Palette className="w-6 h-6 text-white " />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Stickers & Headers</h3>
                <p className="text-gray-600">Perfect for content creators</p>
              </div>
            </div>

            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-3 text-xs text-gray-500">AI Sticker Generator</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">Your prompt:</div>
                    <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-4">
                      "Neon SOLD OUT sticker with glitch effect"
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-24 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Generate</span>
                      </div>
                      <div className="ml-3 text-xs text-gray-500">Creating your sticker...</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-gray-200 rounded-lg w-20 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Popular uses:</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">YouTube Thumbnails</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Product Labels</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Social Media</span>
              </div>
            </div>
          </div>

          {/* Emotes & Reactions */}
          <div className="border-2 border-black rounded-3xl bg-white bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-500  rounded-2xl flex items-center justify-center">
                <span className="text-white text-xl">😊</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Emotes & Reactions</h3>
                <p className="text-gray-600">For streamers & communities</p>
              </div>
            </div>

            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-3 text-xs text-gray-500">AI Sticker Generator</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">Your prompt:</div>
                    <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-4">
                      "Anime-style excited face with sparkle eyes"
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-24 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Generate</span>
                      </div>
                      <div className="ml-3 text-xs text-gray-500">Creating your emote...</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-gray-200 rounded-lg w-20 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Popular uses:</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Twitch Emotes</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Discord Reactions</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Stream Overlays</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UI Assets */}
          <div className="border-2 border-black rounded-3xl bg-white bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-2xl flex bg-green-500 items-center justify-center">
                <div className="w-6 h-6 bg-white rounded border"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">UI Components</h3>
                <p className="text-gray-600">Ready-to-use interface elements</p>
              </div>
            </div>

            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-3 text-xs text-gray-500">AI Sticker Generator</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">Your prompt:</div>
                    <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-4">
                      "Glassmorphism button with subtle glow"
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-24 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Generate</span>
                      </div>
                      <div className="ml-3 text-xs text-gray-500">Creating your UI asset...</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-gray-200 rounded-lg w-20 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Popular uses:</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Figma Assets</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Web Design</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">App UI</span>
              </div>
            </div>
          </div>

          {/* Icons & Symbols */}
          <div className="border-2 border-black rounded-3xl bg-white p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[12px_12px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Icons & Symbols</h3>
                <p className="text-gray-600">Custom iconography made simple</p>
              </div>
            </div>

            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-3 text-xs text-gray-500">AI Sticker Generator</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-2">Your prompt:</div>
                    <div className="bg-gray-100 p-3 rounded-lg text-gray-800 mb-4">
                      "Minimalist shopping cart icon, line style"
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-24 bg-black rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Generate</span>
                      </div>
                      <div className="ml-3 text-xs text-gray-500">Creating your icon...</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 bg-gray-200 rounded-lg w-20 h-20 flex items-center justify-center">
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Popular uses:</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">App Icons</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Navigation</span>
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">Presentations</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Use Cases Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Endless Creative Possibilities</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how creators across industries are using AI-generated assets to enhance their work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              category: "Content Creation",
              icon: "🎬",
              items: [
                "YouTube thumbnail stickers",
                "Instagram story decorations",
                "TikTok video overlays",
                "Podcast cover elements",
                "Newsletter headers",
              ],
            },
            {
              category: "E-commerce & Sales",
              icon: "🛍️",
              items: [
                "Product label stickers",
                "Sale announcement badges",
                "Digital planner assets",
                "Etsy shop graphics",
                "Social media ads",
              ],
            },
            {
              category: "Gaming & Streaming",
              icon: "🎮",
              items: [
                "Twitch emotes",
                "Discord server icons",
                "Stream overlay elements",
                "Gaming thumbnails",
                "Community badges",
              ],
            },
            {
              category: "Web & App Design",
              icon: "💻",
              items: [
                "UI component assets",
                "App icon sets",
                "Website decorations",
                "Loading animations",
                "Button designs",
              ],
            },
            {
              category: "Marketing & Branding",
              icon: "📈",
              items: [
                "Campaign visuals",
                "Brand mascots",
                "Presentation graphics",
                "Social media content",
                "Email signatures",
              ],
            },
            {
              category: "Education & Training",
              icon: "🎓",
              items: [
                "Course thumbnails",
                "Educational icons",
                "Presentation assets",
                "Learning materials",
                "Achievement badges",
              ],
            },
          ].map((useCase, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-2xl bg-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{useCase.icon}</span>
                <h3 className="text-xl font-bold">{useCase.category}</h3>
              </div>
              <ul className="space-y-2">
                {useCase.items.map((item, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Features & Benefits Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose Our AI Sticker Generator</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced AI technology meets user-friendly design for professional results every time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast Generation",
              description:
                "Get professional-quality assets in seconds, not hours. Our AI processes your prompts instantly.",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: <Palette className="w-8 h-8" />,
              title: "Unlimited Style Options",
              description: "From kawaii to minimalist, retro to 3D. Create in any art style you can imagine.",
              color: "from-pink-500 to-purple-500",
            },
            {
              icon: <Download className="w-8 h-8" />,
              title: "Perfect Transparency",
              description: "Every PNG comes with a clean transparent background, ready to use anywhere.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Studio Quality",
              description: "High-resolution outputs that look professional in any context or size.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Commercial License",
              description: "Use your generated assets for personal and commercial projects without restrictions.",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: <Rocket className="w-8 h-8" />,
              title: "Batch Generation",
              description: "Create multiple variations of your design in one go for A/B testing and options.",
              color: "from-red-500 to-pink-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-2xl bg-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 text-white`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple. Fast. Professional.</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No design skills needed. No software required. Just your imagination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">Describe Your Vision</h3>
            <p className="text-gray-600">
              Tell us what you want in plain English. Be as creative or specific as you like.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Creates Magic</h3>
            <p className="text-gray-600">
              Our advanced AI interprets your prompt and generates professional-quality assets.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Download & Use</h3>
            <p className="text-gray-600">
              Get your high-resolution PNG with transparent background, ready to use anywhere.
            </p>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Built for Creators Like You</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're building, streaming, or selling, we've got your visual needs covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Content Creators",
              description: "Thumbnails, overlays, and branded elements that make your content pop",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M10 13l-2 2 2 2" />
                  <path d="M14 17l2-2-2-2" />
                </svg>
              ),
              users: "YouTubers, TikTokers, Podcasters",
            },
            {
              title: "Digital Sellers",
              description: "Create sticker packs and digital assets to sell on Etsy, Gumroad, and more",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              ),
              users: "Etsy Sellers, Digital Artists",
            },
            {
              title: "Streamers",
              description: "Custom emotes and reactions that build community and engagement",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <circle cx="10" cy="13" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              ),
              users: "Twitch Streamers, Discord Admins",
            },
            {
              title: "Designers",
              description: "Quick assets for client work, mockups, and creative projects",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              ),
              users: "UI/UX Designers, Freelancers",
            },
            {
              title: "Developers",
              description: "UI components and icons for apps, websites, and prototypes",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              ),
              users: "Frontend Devs, Indie Hackers",
            },
            {
              title: "Marketers",
              description: "Eye-catching visuals for campaigns, social media, and presentations",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
              users: "Social Media Managers, Agencies",
            },
            {
              title: "Educators",
              description: "Engaging visuals for courses, presentations, and learning materials",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              ),
              users: "Teachers, Course Creators",
            },
            {
              title: "Entrepreneurs",
              description: "Professional assets for startups, products, and business materials",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              ),
              users: "Startup Founders, Business Owners",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-2xl bg-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <div className="w-12 h-12 bg-black rounded-xl mb-4 flex items-center justify-center text-white">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-3">{item.description}</p>
              <div className="text-sm text-gray-500 italic">{item.users}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Style Showcase Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Every Art Style Imaginable</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From cute kawaii to professional minimalist, create in any style that matches your brand
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Kawaii",
              description: "Cute Japanese-inspired style with adorable characters",
              example: "Cute coffee cup with happy face",
            },
            {
              name: "Minimalist",
              description: "Clean, simple designs with limited colors",
              example: "Simple geometric logo with thin lines",
            },
            {
              name: "3D Render",
              description: "Realistic three-dimensional objects with depth",
              example: "3D product mockup with shadows",
            },
            {
              name: "Hand-drawn",
              description: "Sketchy style with natural imperfections",
              example: "Sketched plant with ink details",
            },
            {
              name: "Pixel Art",
              description: "Retro gaming style with visible pixels",
              example: "8-bit character sprite for games",
            },
            {
              name: "Watercolor",
              description: "Soft, painterly style with color blending",
              example: "Watercolor landscape with soft edges",
            },
            {
              name: "Neon",
              description: "Vibrant glowing elements on dark backgrounds",
              example: "Glowing neon sign effect for text",
            },
            {
              name: "Vintage",
              description: "Retro designs inspired by past decades",
              example: "70s-inspired retro badge design",
            },
          ].map((style, i) => (
            <div
              key={i}
              className="border-2 border-black rounded-xl bg-white p-5 shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-[5px_5px_0_rgba(0,0,0,1)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-sm text-gray-500">Style preview</span>
              </div>
              <h3 className="font-bold mb-1">{style.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{style.description}</p>
              <div className="text-xs bg-gray-100 p-2 rounded italic">"{style.example}"</div>
            </div>
          ))}
        </div>
      </div>


      {/* Comparison Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Why AI Beats Traditional Design</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our AI sticker generator compares to traditional design methods
          </p>
        </div>

        <div className="border-2 border-black rounded-3xl bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x-2 divide-black">
            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-red-600">Traditional Design</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Hours or days to complete</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Expensive software required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Need design skills</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Limited by your abilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Costly revisions</span>
                </li>
              </ul>
            </div>

            <div className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Our AI Generator</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Results in seconds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>No software needed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Just describe what you want</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited creative possibilities</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Instant iterations</span>
                </li>
              </ul>
            </div>

            <div className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-600">Hiring Designers</h3>
              <ul className="space-y-3 text-left">
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>$50-200+ per design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Communication delays</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Multiple revisions needed</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>May not match your vision</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-red-500">✗</span>
                  <span>Long turnaround times</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Creators across industries are using our AI sticker generator to enhance their work
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-2 border-black rounded-2xl bg-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)]">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "I've been using this for my Etsy shop and it's been a game-changer. I can create custom sticker packs
                  in minutes instead of hours. My sales have increased by 40% since I started using the AI sticker
                  generator."
                </p>
                <div>
                  <div className="font-bold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Digital Sticker Shop Owner</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-2 border-black rounded-2xl bg-white p-6 shadow-[5px_5px_0_rgba(0,0,0,1)]">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0"></div>
              <div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "As a Twitch streamer, I needed custom emotes but couldn't afford a designer. This tool lets me create
                  professional emotes that my community loves. The transparent PNGs work perfectly on Twitch and
                  Discord."
                </p>
                <div>
                  <div className="font-bold">Mark Rodriguez</div>
                  <div className="text-sm text-gray-500">Twitch Partner & Content Creator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* FAQ Section */}
      <section className="w-full max-w-7xl mx-auto mt-16 md:mt-24 z-10 px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about creating stickers with our AI generator
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-black rounded-xl bg-white shadow-[2px_2px_0_rgba(0,0,0,1)] overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-4 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-white border-2 border-black rounded-xl font-bold shadow-[2px_2px_0_rgba(0,0,0,1)] hover:shadow-[3px_3px_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
          >
            Contact Support
          </a>
        </div>
      </section>
      {/* Final CTA Section */}
      <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 mb-16 z-10 px-4">
        <div className="border-2 border-black rounded-3xl bg-gradient-to-r from-primary-light to-secondary-light p-8 md:p-12 shadow-[8px_8px_0_rgba(0,0,0,1)] text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop searching for the perfect sticker. Just generate it.
          </h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI to bring their ideas to life. Start creating
            professional assets in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              size="lg"
              className="bg-black text-white font-bold text-xl px-12 py-8 rounded-2xl border-2 border-black shadow-[6px_6px_0_rgba(255,255,255,1)] hover:shadow-[8px_8px_0_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
            >
              <Link href="/create">
                Start Creating Now
                <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="font-bold text-xl px-12 py-8 rounded-2xl border-2 border-black bg-white shadow-[6px_6px_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              asChild
            >
              <Link href="/examples">See Examples</Link>
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            No credit card required • Free to start • Professional results guaranteed
          </div>
        </div>
      </div>


    </main>
  )
}
