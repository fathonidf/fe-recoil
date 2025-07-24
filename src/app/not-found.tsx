"use client"

import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Image
        src="/not found.svg"
        alt="404 - Page Not Found"
        width={500}
        height={350}
        priority
        className="max-w-full h-auto object-contain"
      />
    </div>
  )
}