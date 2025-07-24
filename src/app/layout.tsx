import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ConditionalLayout from "../components/conditional-layout"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "ReCoil - Waste Not, Earn A Lot.",
  description:
    "Easily turn liquid waste into cash. ReCoil connects you with trusted recycling agents for a greener planet.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-poppins`}>
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  )
}