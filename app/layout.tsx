import "./globals.css"

import type { Metadata } from "next"
import { Toaster } from "sonner"
import { ReduxProvider } from "@/components/providers/ReduxProvider"

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
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
