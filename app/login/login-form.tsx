"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { login, signup } from "./actions"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        })
      }
    } catch (error) {
      const message = "An unexpected error occurred"
      setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Add redirect URL to form data if present
      const redirect = searchParams.get("redirect")
      if (redirect) {
        formData.append("redirect", redirect)
      }

      if (isSignUp) {
        const result = await signup(formData)
        if (result.error) {
          setError(result.error)
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
        } else if (result.success) {
          toast({
            title: "Success",
            description: result.message,
          })
          router.push("/login")
        }
      } else {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error,
          })
        } else if (result?.success) {
          // Use router.push for client-side navigation
          router.push(result.redirectTo)
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-[4px_4px_0_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-center text-3xl font-bold">{isSignUp ? "Create an account" : "Welcome back"}</h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700 border-2 border-red-200">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(new FormData(e.currentTarget))
        }}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full rounded-md border-2 border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md border-2 border-black bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Signing up..." : "Signing in..."}
                </span>
              ) : (
                isSignUp ? "Sign up" : "Sign in"
              )}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-md border-2 border-black bg-white px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="ml-2">Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-medium text-primary hover:text-primary-dark"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}