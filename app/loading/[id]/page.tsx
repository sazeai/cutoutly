"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

type ComicStatus = {
  id: string
  status: "processing" | "completed" | "failed"
  comic_url?: string
  error_message?: string
  progress_stage?: string
  progress_percent?: number
}

const POLLING_INTERVAL = 3000 // 3 seconds
const MAX_RETRIES = 3 // Maximum number of retries for API calls

const PROCESSING_STAGES: Record<string, string> = {
  initializing: "Preparing your comic",
  image_uploaded: "Image uploaded successfully",
  processing_started: "Starting the comic generation",
  prompt_generated: "Creating your comic story",
  image_downloaded: "Preparing your image",
  calling_openai: "Drawing your comic panels",
  comic_generated: "Comic created successfully",
  result_uploaded: "Finalizing your comic",
  completed: "Comic is ready!",
}

export default function LoadingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [dots, setDots] = useState(".")
  const [status, setStatus] = useState<ComicStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [lastProcessed, setLastProcessed] = useState<Date | null>(null)
  const [stalled, setStalled] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [debugMode, setDebugMode] = useState(false)
  const [apiLogs, setApiLogs] = useState<string[]>([])

  // Animate the dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."))
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  // Check for stalled processing
  useEffect(() => {
    if (lastProcessed) {
      const stallCheckInterval = setInterval(() => {
        const now = new Date()
        const timeSinceLastProcess = now.getTime() - lastProcessed.getTime()

        // If no updates for 2 minutes, consider it stalled
        if (timeSinceLastProcess > 120000) {
          setStalled(true)
          clearInterval(stallCheckInterval)
        }
      }, 10000) // Check every 10 seconds

      return () => clearInterval(stallCheckInterval)
    }
  }, [lastProcessed])

  // Add a log entry
  const addLog = (message: string) => {
    setApiLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`])
  }

  // Poll for status updates
  useEffect(() => {
    if (!isPolling) return

    const checkStatus = async () => {
      try {
        addLog("Checking comic status...")

        // First check the status
        const statusResponse = await fetch(`/api/comic-status/${params.id}`)

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.statusText}`)
        }

        const statusData = await statusResponse.json()
        setStatus(statusData)
        addLog(
          `Status: ${statusData.status}, Stage: ${statusData.progress_stage}, Progress: ${statusData.progress_percent}%`,
        )

        // If we have a last_processed timestamp, update it
        if (statusData.last_processed) {
          setLastProcessed(new Date(statusData.last_processed))
        }

        // Handle different statuses
        if (statusData.status === "completed") {
          addLog("Comic completed successfully!")
          setIsPolling(false)
          router.push(`/result/${params.id}`)
          return
        }

        if (statusData.status === "failed") {
          addLog(`Comic generation failed: ${statusData.error_message}`)
          setIsPolling(false)
          setError(statusData.error_message || "Comic generation failed")
          return
        }

        // Reset retry count if we're making progress
        if (statusData.progress_percent > (status?.progress_percent || 0)) {
          setRetryCount(0)
        }

        // If still processing, trigger the next processing step
        if (statusData.status === "processing") {
          addLog("Triggering next processing step...")

          // Call the process endpoint to continue processing
          const processResponse = await fetch(`/api/process-comic/${params.id}`, {
            method: "POST",
          })

          if (!processResponse.ok) {
            const errorData = await processResponse.json()
            addLog(`Process error: ${JSON.stringify(errorData)}`)

            // Increment retry count
            setRetryCount((prev) => prev + 1)

            if (retryCount >= MAX_RETRIES) {
              addLog("Max retries reached, stopping polling")
              setIsPolling(false)
              setError("Failed to process comic after multiple attempts. Please try again.")
            }
          } else {
            const processData = await processResponse.json()
            addLog(`Process response: ${JSON.stringify(processData)}`)
          }
        }
      } catch (error: any) {
        addLog(`Error: ${error.message}`)
        console.error("Error checking comic status:", error)

        // Increment retry count
        setRetryCount((prev) => prev + 1)

        if (retryCount >= MAX_RETRIES) {
          addLog("Max retries reached, stopping polling")
          setIsPolling(false)
          setError("Failed to check comic status after multiple attempts. Please try again.")
        }
      }
    }

    // Check status immediately and then every POLLING_INTERVAL
    checkStatus()
    const statusInterval = setInterval(checkStatus, POLLING_INTERVAL)

    return () => clearInterval(statusInterval)
  }, [params.id, router, isPolling, status, retryCount])

  // Get the message based on the current progress stage
  const getMessage = () => {
    if (!status || !status.progress_stage) {
      return "Preparing your comic..."
    }

    return PROCESSING_STAGES[status.progress_stage] || "Processing your comic..."
  }

  const handleRetry = () => {
    setError(null)
    setStalled(false)
    setRetryCount(0)
    setIsPolling(true)
  }

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
        {error ? (
          <div className="space-y-6">
            <div className="text-red-500 text-xl font-bold">{error}</div>
            <div className="flex gap-4 justify-center">
              <Button onClick={handleRetry} className="bg-secondary hover:bg-secondary-dark">
                Retry
              </Button>
              <Button onClick={() => router.push("/create")} className="bg-primary hover:bg-primary-dark">
                Start Over
              </Button>
            </div>
          </div>
        ) : stalled ? (
          <div className="space-y-6">
            <div className="text-amber-600 text-xl font-bold">
              Your comic is taking longer than expected to generate.
            </div>
            <p className="text-gray-600">The process might be stuck. You can wait a bit longer or try again.</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  setStalled(false)
                  setIsPolling(true)
                }}
                className="bg-secondary hover:bg-secondary-dark"
              >
                Keep Waiting
              </Button>
              <Button onClick={() => router.push("/create")} className="bg-primary hover:bg-primary-dark">
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
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
            <h1 className="text-3xl font-bold mb-4">Drawing your mood{dots}</h1>
            <p className="text-gray-600 text-lg">{getMessage()}</p>

            {/* Progress bar */}
            <div className="mt-8 mb-4">
              <Progress value={status?.progress_percent || 0} className="h-2 bg-gray-200" />
              <p className="text-sm text-gray-500 mt-2">{status?.progress_percent || 0}% complete</p>
            </div>

            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div
                className="w-3 h-3 rounded-full bg-secondary animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-gray-500">
                Comic ID: {params.id}
                <br />
                This may take up to 1-2 minutes. Please be patient.
              </p>

              <button onClick={() => setDebugMode(!debugMode)} className="text-xs text-gray-400 underline mt-4">
                {debugMode ? "Hide Debug Info" : "Show Debug Info"}
              </button>

              {debugMode && (
                <div className="mt-4 p-4 bg-black bg-opacity-80 rounded-lg text-left overflow-auto max-h-60 text-xs text-green-400 font-mono">
                  <p className="mb-2 text-white">Current Stage: {status?.progress_stage || "unknown"}</p>
                  <p className="mb-2 text-white">API Logs:</p>
                  <div className="overflow-y-auto max-h-40">
                    {apiLogs.map((log, index) => (
                      <div key={index} className="mb-1 text-xs whitespace-pre-wrap break-all">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
