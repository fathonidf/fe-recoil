"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
import { useAuthContext } from "@/contexts/AuthContext"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { isAuthenticated, logout, isLoading, user } = useAuthContext()

  const navItems = useMemo(() => {
    const baseItems = [
      { href: "/#about", label: "About us", matchPath: "/" },
      { href: "/exchange", label: "Eco Exchange", matchPath: "/exchange" },
      { href: "/community", label: "Community", matchPath: "/community" },
      { href: "/chatbot", label: "AI Chatbot", matchPath: "/chatbot" },
    ]
    
    return baseItems
  }, [])

  // Only run on client after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = useCallback((matchPath: string) => {
    if (!mounted) return false
    
    if (matchPath === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(matchPath)
  }, [mounted, pathname])

  const updateUnderline = useCallback(() => {
    if (!navRef.current || !mounted) return

    const activeIndex = navItems.findIndex(item => isActive(item.matchPath))
    
    if (activeIndex === -1) {
      setUnderlineStyle({ left: 0, width: 0 })
      return
    }

    const navLinks = navRef.current.querySelectorAll('a')
    const activeLink = navLinks[activeIndex]
    
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect()
      const linkRect = activeLink.getBoundingClientRect()
      
      setUnderlineStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width
      })
    }
  }, [mounted, navItems, isActive])

  useEffect(() => {
    if (mounted) {
      updateUnderline()
      const handleResize = () => updateUnderline()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [pathname, mounted, updateUnderline])

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
  }

  // Prevent hydration mismatch by using consistent classes initially
  if (!mounted) {
    return (
      <nav className="flex items-center justify-between px-6 py-4 relative bg-transparent">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <Image
            src="/logo header.svg"
            alt="ReCoil Logo"
            width={128}
            height={128}
            priority
          />
        </Link>

        {/* Desktop Navigation - Server render with consistent classes */}
        <div className="hidden md:flex items-center space-x-8 relative">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-primary hover:text-primary transition-colors cursor-pointer relative z-10"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Placeholder for animated underline */}
          <div 
            className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
            style={{
              left: 0,
              width: 0,
              transform: 'translateY(8px)'
            }}
          />
        </div>

        {/* Desktop Login Button */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative group">
              {/* User Info Display */}
              <div className="flex flex-col items-end cursor-pointer">
                <span className="text-secondary font-semibold text-base">
                  Hi, {user?.username || 'User'}!
                </span>
                <div className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-8 py-3 rounded-lg text-lg transition-all duration-300 font-medium flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>member</span>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg transition-all duration-300">
                Log In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-primary cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
    )
  }

  // Client render with enhanced features
  return (
    <nav className="flex items-center justify-between px-6 py-4 relative bg-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center space-x-2 cursor-pointer">
        <Image
          src="/logo header.svg"
          alt="ReCoil Logo"
          width={128}
          height={128}
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div ref={navRef} className="hidden md:flex items-center space-x-8 relative">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            className={`transition-colors cursor-pointer relative z-10 ${
              isActive(item.matchPath)
                ? "text-primary font-bold"
                : "text-primary hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Animated Underline */}
        <div 
          className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
            transform: 'translateY(8px)'
          }}
        />
      </div>

        {/* Desktop Login Button */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative group">
              {/* User Info Display */}
              <div className="flex flex-col items-center cursor-pointer">
                <span className="text-secondary font-semibold text-xl">
                  Hi, {user?.username || 'User'}!
                </span>
                <div className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-white hover:text-[#123524] px-3 py-1 rounded-lg text-lg transition-all duration-300 font-medium flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <span>member</span>
                </div>
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                    <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full flex items-center rounded-lg px-4 py-2 text-gray-700 hover:bg-red-500 hover:rounded-lg hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                    >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3V1" />
                    </svg>
                    {isLoading ? 'Logging out...' : 'Log Out'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg transition-all duration-300">
                Log In
              </Button>
            </Link>
          )}
        </div>      {/* Mobile Menu Button */}
      <button className="md:hidden text-primary cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg md:hidden z-50">
          <div className="flex flex-col space-y-4 p-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors cursor-pointer ${
                  isActive(item.matchPath)
                    ? "text-primary font-bold underline decoration-2 underline-offset-4"
                    : "text-primary hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex flex-col items-center space-y-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-primary font-semibold text-base">
                    Hi, {user?.username || 'User'}!
                  </span>
                  <div className="bg-gradient-to-r from-[#04BB84] to-[#FFE51C] text-[#FFFECF] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-8 py-3 rounded-lg text-lg transition-all duration-300 font-medium flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>member</span>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full p-3 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </Link>
                <Button 
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
                >
                  {isLoading ? 'Logging out...' : 'Log Out'}
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
                <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg w-full transition-all duration-300">
                  Log In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}