"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { LogOut } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

interface UserProfileProps {
  user: User
}

export function UserProfile({ user }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  // Get first letter of email or username for avatar
  const userInitial = user.email?.[0].toUpperCase() || user.user_metadata?.name?.[0].toUpperCase() || "U"

  // Get display name (username, email before @, or first part of email)
  const displayName = user.user_metadata?.name || user.email?.split("@")[0] || user.email?.substring(0, 6) + "..."

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium hover:bg-gray-200"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          {userInitial}
        </span>
        <span className="max-w-[80px] truncate">{displayName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border-2 border-black bg-white py-1 shadow-[0_4px_0_rgba(0,0,0,0.3)]">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="text-xs text-gray-500">Signed in as</p>
            <p className="truncate text-sm font-medium">{user.email}</p>
          </div>
          <a href="/dashboard" className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            Dashboard
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
