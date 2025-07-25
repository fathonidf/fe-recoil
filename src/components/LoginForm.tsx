"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  
  const { login, isLoading } = useAuthContext()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      const result = await login(email, password)
      
      if (result.success) {
        // Redirect to the page user was trying to access, or home
        const redirectUrl = searchParams.get('redirect') || '/'
        router.push(redirectUrl)
      } else {
        setError(result.error || "Login failed")
      }
    } catch {
      setError("An unexpected error occurred")
    }
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