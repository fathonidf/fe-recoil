"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    // Static demo - just simulate loading and redirect to home
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, always "login successfully"
      router.push('/')
    }, 1000)
  }

  return (
    <div className="relative min-h-screen">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Login Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full space-y-8">
            {/* Back to Home Button */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-black hover:text-secondary/80 transition-colors w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </Link>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-text">Account Login</h1>
              <p className="text-text-muted">
                If you are already a member you can login with your email address and password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-secondary font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-secondary font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-secondary/30 focus:border-secondary"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked: boolean) => setRememberMe(checked)}
                />
                <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer">
                  Remember me
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-white py-3 hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-8 py-3 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-text-muted">
                {"Don't have an account? "}
                <Link href="/register" className="text-secondary hover:underline cursor-pointer">
                  Register here
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-text-muted mb-4">or login by</p>
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 bg-transparent">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </div>
          </div>
        </div>

        {/* Illustration - Full Coverage */}
        <div className="hidden lg:block relative">
          <Image
            src="/auth_page/login image.svg"
            alt="Login illustration with people holding phones"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}