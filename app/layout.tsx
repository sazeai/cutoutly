import type React from "react"
import "./globals.css"
import { Outfit, Fredoka } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

// Use Next.js optimized fonts instead of external Google Fonts
const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  // This will make Next.js optimize and self-host the font
  variable: "--font-outfit",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  // This will make Next.js optimize and self-host the font
  variable: "--font-fredoka",
})

/* 
{
  To switch back to the previous font setup:
  1. Uncomment the Google Fonts import in globals.css
  2. Replace the font-comic class in globals.css to use 'Pacifico' again
  3. You can keep this layout.tsx file as is, as it will still work with the CSS changes
}
*/

export const metadata = {
  title: "ComicVibe - Turn your mood into a comic strip",
  description: "Upload your selfie, tell us how you're feeling, and get a comic strip that screams YOU.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${fredoka.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
