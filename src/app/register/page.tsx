"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    userType: "member",
    companyName: "",
    password: "",
    verification: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle registration logic here
    console.log(formData)
  }

  return (
    <div className="relative py-12 min-h-screen">
      {/* Blur blob at top-right corner with 90-degree rotation */}
      <div className="absolute -top-80 -right-80 z-0 rotate--180">
        <Image
          src="/landing_page/blur blob.svg"
          alt="background blob"
          width={950}
          height={950}
        />
      </div>

      <div className="flex justify-center items-center min-h-screen px-auto relative z-10">
        <div className="max-w-4xl w-full">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-black hover:text-secondary/80 transition-colors w-fit mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-text">Register Account</h1>
            <p className="text-text-muted">Become a member and enjoy exclusive promotions.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-secondary font-medium">Username</label>
              <Input
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="border-secondary/30 focus:border-secondary"
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-secondary font-medium">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="border-secondary/30 focus:border-secondary"
                required
              />
            </div>

            {/* Email and Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-secondary font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary font-medium">Phone number</label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-secondary font-medium">Address</label>
              <Input
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="border-secondary/30 focus:border-secondary"
                required
              />
            </div>

            {/* Province and City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-secondary font-medium">Province</label>
                <Input
                  placeholder="Enter your province"
                  value={formData.province}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary font-medium">City</label>
                <Input
                  placeholder="Enter your city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
            </div>

            {/* Register as */}
            <div className="space-y-3">
              <label className="text-secondary font-medium">Register as</label>
              <RadioGroup
                value={formData.userType}
                onValueChange={(value) => handleInputChange("userType", value)}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="member" id="member" />
                  <Label htmlFor="member">Member</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="agent" id="agent" />
                  <Label htmlFor="agent">Agent</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Company Name (only for agents) */}
            {formData.userType === "agent" && (
              <div className="space-y-2">
                <label className="text-secondary font-medium">Company/Organization Name</label>
                <Input
                  placeholder="Enter your company name"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
            )}

            {/* Password and Verification */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-secondary font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-secondary font-medium">Verification</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.verification}
                  onChange={(e) => handleInputChange("verification", e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-1/2 text-white py-3 hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-8 py-3 rounded-lg transition-all duration-300 rounded-lg">
              Continue
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-secondary hover:underline cursor-pointer">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom vector SVG - Cropped */}
      <div className="absolute bottom-0 -left-5 w-full h-50 overflow-hidden z-0">
        <div className="scale-125 w-full">
          <Image
        src="/auth_page/bottom vector.svg"
        alt="bottom vector decoration"
        width={2000}
        height={500}
        className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  )
}