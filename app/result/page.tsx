import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Twitter, Instagram, Linkedin, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"

export default function ResultPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary-light via-white to-secondary-light overflow-hidden relative">
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

      <Header currentPage="Your Comic" />

      <div className="w-full max-w-7xl mx-auto mt-16 z-10 px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Comic Strip */}
          <div>
            <h1 className="text-4xl font-bold mb-8">Your Comic Strip is Ready!</h1>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square border-2 border-black rounded-lg overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,1)]"
                >
                  <Image
                    src={`/comic-panel.png?height=300&width=300&query=comic panel ${i + 1} with person`}
                    alt={`Comic panel ${i + 1}`}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Download Options */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Download Options</h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  <Download size={18} />
                  Full Strip
                </Button>
                {[...Array(3)].map((_, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Download size={18} />
                    Panel {i + 1}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sharing & Caption */}
          <div className="space-y-8">
            <Card className="border-2 border-black p-6 shadow-[8px_8px_0_rgba(0,0,0,1)] bg-white">
              {/* Share Options */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Share Your Comic</h2>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Twitter size={18} />X
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <MessageCircle size={18} />
                    Threads
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Instagram size={18} />
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-primary flex items-center gap-2 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Linkedin size={18} />
                    LinkedIn
                  </Button>
                </div>
              </div>

              {/* Caption Ideas */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Caption Ideas</h2>
                <Tabs defaultValue="funny">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="funny">Funny</TabsTrigger>
                    <TabsTrigger value="relatable">Relatable</TabsTrigger>
                    <TabsTrigger value="inspirational">Inspirational</TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="funny"
                    className="border-2 border-primary rounded-lg p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <p className="text-gray-700">"When the code finally works but you don't know why 😂 #ComicVibe"</p>
                  </TabsContent>
                  <TabsContent
                    value="relatable"
                    className="border-2 border-primary rounded-lg p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <p className="text-gray-700">
                      "This is literally me every Monday morning. Who can relate? #ComicVibe"
                    </p>
                  </TabsContent>
                  <TabsContent
                    value="inspirational"
                    className="border-2 border-primary rounded-lg p-4 shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  >
                    <p className="text-gray-700">
                      "Turning challenges into comic strips, one panel at a time. #ComicVibe"
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Create Another Button */}
              <div className="flex gap-4">
                <Button className="flex-1 py-6 text-xl font-bold bg-gradient-to-r from-primary to-secondary border-none shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all">
                  Create Another
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-6 text-xl font-bold border-2 border-primary shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all"
                >
                  View Gallery
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
