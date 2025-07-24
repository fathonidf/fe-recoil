"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 150, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: 0.3
        }}
      >
        <Image
          src="/not found.svg"
          alt="404 - Page Not Found"
          width={500}
          height={350}
          priority
          className="max-w-full h-auto object-contain"
        />
      </motion.div>
    </div>
  )
}