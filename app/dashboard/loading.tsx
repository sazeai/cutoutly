import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
            <div className="h-6 w-32 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 container space-y-8 p-8 pt-6">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-96 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Content Grid */}
        <div className="grid gap-4 container md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="space-y-4">
                <div className="h-6 w-3/4 animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded-md bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-200" />
                <div className="flex items-center justify-between">
                  <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
                  <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Spinner */}
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    </div>
  )
} 