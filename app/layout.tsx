import "./globals.css"

import type { Metadata } from "next"
import { Toaster } from "sonner"
import { ReduxProvider } from "@/components/providers/ReduxProvider"
import { Outfit, JetBrains_Mono } from "next/font/google"

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "CoverCraft | AI-Powered Cover Letter Generator",
  description: "Create stunning, personalized cover letters in seconds. CoverCraft uses AI to craft professional cover letters tailored to your dream job.",
  keywords: ["cover letter", "AI", "job application", "resume", "career"],
  authors: [{ name: "CoverCraft" }],
  openGraph: {
    title: "CoverCraft | AI-Powered Cover Letter Generator",
    description: "Create stunning, personalized cover letters in seconds.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`min-h-screen antialiased ${outfit.variable} ${jetbrainsMono.variable}`}>
        <ReduxProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  )
}
