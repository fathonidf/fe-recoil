"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {

  return (
    <>
      {/* Hero Section */}
      <motion.section 
        className="container mx-auto px-6 py-20"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src="/landing_page/illustration landing page.png"
              alt="People with recycling illustration"
              width={600}
              height={500}
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-7xl lg:text-7xl font-bold text-black leading-tight">
              Waste Not,<br />Earn A Lot.
            </h1>
            <p className="text-lg text-text-muted max-w-md">
              Easily turn liquid waste into cash. ReCoil connects you with trusted recycling agents for a greener planet.
            </p>
            <Link href="/#about">
              <Button className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-8 py-3 rounded-lg text-lg transition-all duration-300">
                Find out more
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Who Are We Section */}
      <motion.section 
        id="about"
        className="container mx-auto px-6 py-20 relative"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Background blur blob */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing_page/blur blob.svg"
            alt="background blob"
            width={700}
            height={700}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <motion.div 
          className="flex flex-col space-y-3 relative z-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Title Row */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            animate={{
              y: [-5, 5, -5],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <Image
              src="/landing_page/recoil who are we.svg"
              width={600}
              height={100}
              className="mx-auto"
              alt="ReCoil Who Are We Title"
            />
          </motion.div>

          {/* Content Row */}
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <div className="relative">
              {/* Smiling droplets positioned at top of container */}
              <motion.div 
                className="absolute -top-20 left-8 z-30"
                whileHover={{ rotate: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Image
                  src="/landing_page/smiling droplets.svg"
                  alt="smiling droplets icon"
                  width={150}
                  height={150}
                />
              </motion.div>

              {/* 3D Background container with gradient - positioned to the left */}
              <div className="absolute top-4 -left-4 w-full h-full bg-gradient-to-br from-[#04BB84] via-[#02A99D] to-[#FFE51C] rounded-3xl z-0"></div>

              {/* Text container with background */}
              <div className="relative bg-white rounded-3xl p-8 pt-12 shadow-lg border border-gray-100 z-20">
                <p className="text-black leading-loose text-justify">
                  At ReCoil, our purpose is to make the circular economy a simple and profitable reality for everyone. We provide a trusted digital marketplace that directly connects used oil producers with recycling agents, eliminating middlemen to ensure fair pricing. Through our platform, users can not only sell their used cooking oil but also purchase recycled products. Guided by our smart Eco AI for personalized insights and supported by a vibrant Community for shared learning, ReCoil transforms hazardous waste into a valuable opportunity.
                </p>
              </div>
            </div>

            <div className="relative -mt-8">
              <Image
                src="/landing_page/oils image.png"
                alt="Cooking oil waste"
                width={1000}
                height={1000}
                className="w-full h-auto object-cover rounded-lg"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
    </>
  )
}