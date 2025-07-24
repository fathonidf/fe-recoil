"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef, useMemo } from "react"
import { usePathname } from "next/navigation"
import { useCallback } from "react"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const navItems = useMemo(() => [
    { href: "/#about", label: "About us", matchPath: "/" },
    { href: "/exchange", label: "Eco Exchange", matchPath: "/exchange" },
    { href: "/community", label: "Community", matchPath: "/community" },
    { href: "/chatbot", label: "AI Chatbot", matchPath: "/chatbot" },
  ], [])

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

  // Prevent hydration mismatch by using consistent classes initially
  if (!mounted) {
    return (
      <nav className="flex items-center justify-between px-6 py-4 relative">
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
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Login Button */}
        <div className="hidden md:block">
          <Link href="/login">
            <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg transition-all duration-300">
              Log In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-secondary cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
    )
  }

  // Client render with enhanced features
  return (
    <nav className="flex items-center justify-between px-6 py-4 relative">
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
                : "text-secondary hover:text-primary"
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
        <Link href="/login">
          <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg transition-all duration-300">
            Log In
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-secondary cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
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
                    : "text-secondary hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer">
              <Button className="bg-gradient-to-b from-[#04BB84] to-[#02A99D] hover:bg-gradient-to-r hover:from-[#FFE51C] hover:to-[#FFFECF] text-[#FFFECF] hover:text-[#123524] px-6 py-2 rounded-lg w-full transition-all duration-300">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}