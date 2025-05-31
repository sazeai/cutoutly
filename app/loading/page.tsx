import { Header } from "@/components/header"

export default function LoadingPage() {
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

      <Header currentPage="Processing" />

      <div className="w-full max-w-md text-center z-10">
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
              className="text-primary"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h2" />
              <path d="M8 17h2" />
              <path d="M14 13h2" />
              <path d="M14 17h2" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Drawing your mood...</h1>
        <p className="text-gray-600 text-lg">Sipping coffee between strokes</p>

        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-3 h-3 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </main>
  )
}
