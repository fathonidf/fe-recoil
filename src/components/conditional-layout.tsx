"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import BackgroundVectors from "@/components/background-vectors"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showNavigationFooter = pathname !== '/login' && pathname !== '/register'
  const showFooter = showNavigationFooter && pathname !== '/chatbot/chat'

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Vectors with Parallax Effect */}
      {showNavigationFooter && <BackgroundVectors />}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {showNavigationFooter && <Navigation />}
        <main className={`flex-1 ${showNavigationFooter ? 'pt-20' : ''}`}>
          {children}
        </main>
        {showFooter && <Footer />}
      </div>
    </div>
  )
}