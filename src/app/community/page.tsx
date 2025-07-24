"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CommunityPage() {

  return (
    <div className="min-h-screen">
      {/* Community Section */}
      <motion.section
        className="container mx-auto px-6 py-20"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold text-black leading-tight">Community</h1>
            <p className="text-lg text-gray-700 max-w-md">
              Join the conversation, learn from fellow eco-champions,
              and help turn every drop of waste into opportunity!
            </p>

            <div className="space-y-6">
              {/* Blog Section */}
              <Link href="/community/blog" className="block">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100 cursor-pointer mb-6"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2}}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <Image
                      src="/community_page/blog icon.svg"
                      alt="Blog Icon"
                      width={50}
                      height={50}
                    />
                    <h2 className="text-4xl font-bold text-black">Blog</h2>
                  </div>
                  <p className="text-gray-600">
                    Inspiring stories, how-tos, and deep dives on liquid-waste recycling
                  </p>
                </motion.div>
              </Link>

              {/* QnA Section */}
              <Link href="community/qna" className="block">
                <motion.div
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-gray-100 cursor-pointer"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2}}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <Image
                      src="/community_page/qna icon.svg"
                      alt="QnA Icon"
                      width={50}
                      height={50}
                    />
                    <h2 className="text-4xl font-bold text-black">QnA</h2>
                  </div>
                  <p className="text-gray-600">
                    Ask your questions, get expert answers, and share your own tips
                  </p>
                </motion.div>
              </Link>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/community_page/community.svg"
              alt="Community Illustration"
              width={873}
              height={631}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </motion.section>
    </div>
  )
}