"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "Sorry, something went wrong"

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light/30 via-white to-secondary-light/30 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border-2 border-black bg-white p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0)]">
          <h2 className="mb-6 text-center text-3xl font-bold text-red-600">Error</h2>

          <div className="mb-6 rounded-md bg-red-50 p-4 text-center text-red-700">{error}</div>

          <div className="flex justify-center">
            <Link
              href="/"
              className="rounded-md border-2 border-black bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
