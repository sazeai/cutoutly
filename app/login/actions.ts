"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function login(formData: FormData) {
  try {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      return { error: error.message }
    }

    // Get the redirect URL from the form data or default to dashboard
    const redirectTo = formData.get("redirect") as string || "/dashboard"

    // Revalidate the layout to update auth state
    revalidatePath("/", "layout")

    // Return success with redirect URL
    return { 
      success: true, 
      redirectTo 
    }
  } catch (error) {
    console.error("Login error:", error)
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}

export async function signup(formData: FormData) {
  try {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signUp({
      ...data,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath("/", "layout")
    return { success: true, message: "Check your email to confirm your account" }
  } catch (error) {
    console.error("Signup error:", error)
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    }
  }
}