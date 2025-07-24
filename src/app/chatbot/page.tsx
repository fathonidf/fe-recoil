"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuthContext } from "@/contexts/AuthContext"

export default function ChatbotPage() {
  const { isAuthenticated } = useAuthContext()

  // Always show the landing page regardless of authentication status
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Chatbot Section */}
      <motion.section
        className="container mx-auto px-6 pt-10 relative z-10"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
          <div className="grid lg:grid-cols-2 gap-0 items-center relative">
            {/* Left Side - Content with higher z-index */}
            <div className="space-y-8 relative z-20 pr-12">
              {/* Title and Subtitle Container */}
              <div className="space-y-3">
                <motion.div
                  className="inline-block bg-white shadow-lg rounded-full px-8 py-4"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight whitespace-nowrap">
                    Eco AI
                  </h1>
                </motion.div>

                <motion.div
                  className="inline-block bg-white shadow-lg rounded-full px-4 py-3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <p className="text-lg text-gray-700 whitespace-nowrap">
                    Have a question? Ask our AI anything.
                  </p>
                </motion.div>
              </div>

              {/* Two Column: Character + Button */}
              <motion.div
                className="grid grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {/* Left: AI Character */}
                <div className="flex justify-center">
                  <Image
                    src="/eco character.svg"
                    alt="AI Character"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>

                {/* Right: Ask Eco Button - Conditional redirect based on authentication */}
                <div className="flex justify-center relative z-30">
                  <Link href={isAuthenticated ? "/chatbot/chat" : "/login"}>
                    <motion.button
                      className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg text-lg transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Ask Eco</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Image with lower z-index and overlap */}
            <motion.div
              className="relative z-10 -ml-24 flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Image
                src="/chatbot_page/Chatbot UI Image.svg"
                alt="Chatbot UI"
                width={600}
                height={500}
                priority
                className="object-contain rounded-2xl"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Bottom vector SVG - Extended to reach character level */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-0" style={{ height: '400px' }}>
          <Image
            src="/auth_page/bottom vector.svg"
            alt="bottom vector decoration"
            width={2000}
            height={1500}
            className="object-cover object-top scale-175"
          />
        </div>
      </div>
    )
}