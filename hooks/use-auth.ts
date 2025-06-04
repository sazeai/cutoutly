"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
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

  return { user, loading }
} 