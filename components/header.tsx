"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client"
import { UserProfile } from "./user-profile"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  currentPage?: string
  initialUser?: User | null
}

export function Header({ currentPage, initialUser }: HeaderProps) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    if (!initialUser) {
      getUser()
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [initialUser])

  return (
    <div className="fixed top-6 left-4 right-4 z-50">
      <div className="mx-auto max-w-7xl bg-white border-2 border-black rounded-full px-4 py-2 flex justify-between items-center shadow-[0_4px_0_rgba(0,0,0,0.3)]">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold mr-2 font-comic text-primary">Cutoutly</span>
          <span className="text-sm bg-gradient-to-r from-primary to-secondary text-white px-2 py-0.5 rounded-full">
            Beta
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {user ? (
            <>
              <UserProfile user={user} />
              {!currentPage && (
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 text-sm font-bold text-black bg-gradient-to-r from-primary-light to-secondary-light rounded-full shadow-[0_4px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,1)] transition-all"
                >
                  Create
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mr-2 px-3 py-1 text-sm font-medium text-black bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                Sign In
              </Link>
              {!currentPage && (
                <Link
                  href="/dashboard"
                  className="px-4 py-1.5 text-sm font-bold text-black bg-gradient-to-r from-primary-light to-secondary-light rounded-full shadow-[0_4px_0_rgba(0,0,0,1)] transform hover:translate-y-0.5 hover:shadow-[0_2px_0_rgba(0,0,0,1)] transition-all"
                >
                  Create
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border-2 border-black rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.3)] py-2 md:hidden">
            {user ? (
              <>
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="truncate text-sm font-medium">{user.email}</p>
                </div>
                <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100">
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    setMobileMenuOpen(false)
                    window.location.href = "/"
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Create
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
