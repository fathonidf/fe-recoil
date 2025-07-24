import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import ConditionalLayout from "../components/conditional-layout"

export const metadata: Metadata = {
  title: "ReCoil - Turn Waste Into Worth",
  description:
    "Ubah limbah cair jadi cuan dengan mudah. ReCoil menghubungkan Anda dengan agen daur ulang terpercaya untuk bumi yang lebih hijau.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-poppins`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  )
}