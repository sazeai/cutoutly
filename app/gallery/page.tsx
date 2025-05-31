import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { createServerSupabaseClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default async function GalleryPage() {
  const supabase = createServerSupabaseClient()

  // Fetch all completed comics
  const { data: comics } = await supabase
    .from("comics")
    .select("*")
    .eq("status", "completed")
    .order("created_at", { ascending: false })

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

      <Header currentPage="Gallery" />

      <div className="w-full max-w-7xl mx-auto mt-16 z-10 px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Comic Gallery</h1>
          <Link href="/create">
            <Button className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-primary to-secondary border-none shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all">
              Create New Comic
            </Button>
          </Link>
        </div>

        {comics && comics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comics.map((comic) => (
              <Link href={`/result/${comic.id}`} key={comic.id}>
                <div className="border-2 border-black rounded-xl overflow-hidden bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                  <div className="aspect-square relative">
                    <Image
                      src={comic.comic_url || "/placeholder.svg?height=400&width=400&query=comic%20strip"}
                      alt={`Comic: ${comic.mood}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-lg truncate">{comic.mood}</p>
                    <p className="text-gray-600 text-sm">{new Date(comic.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">No comics yet!</h2>
            <p className="text-gray-600 mb-8">Create your first comic to see it here.</p>
            <Link href="/create">
              <Button className="px-6 py-3 text-lg font-bold bg-gradient-to-r from-primary to-secondary border-none shadow-[0_6px_0_rgba(0,0,0,1)] hover:shadow-[0_4px_0_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all">
                Create Your First Comic
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
