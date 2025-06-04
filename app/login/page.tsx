import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { LoginForm } from "./login-form"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Login | Cutoutly",
  description: "Login to your Cutoutly account",
}

export default async function LoginPage() {
  const supabase = await createClient()

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <>
      <Header currentPage="Login" />
      <div className="relative pt-24">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>


        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Image src="/colorful-cartoon-c-logo.png" alt="Cutoutly Logo" fill className="object-cover" />
                </div>
                <span className="text-3xl font-bold text-primary">Cutoutly</span>
              </Link>
            </div>

    

          
              <LoginForm />
            
          </div>
        </div>
      </div>
    </>
  )
}