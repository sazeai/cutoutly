"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Header } from "@/components/header"
import { DashboardClient } from "./dashboard-client"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const getUser = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login?redirect=/dashboard")
          return
        }

        setUser(user)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/login?redirect=/dashboard")
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login?redirect=/dashboard")
        return
      }

      setUser(session.user)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-light/30 via-white to-secondary-light/30">
      <Header currentPage="Dashboard" />
      <DashboardClient user={user} />
    </main>
  )
}
