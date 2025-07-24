'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function BackgroundVectors() {
  const pathname = usePathname()
  
  // Show on home, community pages, and when no specific route matches (404/not-found scenarios)
  const shouldShowBackground = pathname === '/' || pathname === '/community' || !pathname.startsWith('/chatbot') && !pathname.startsWith('/login') && !pathname.startsWith('/register') && !pathname.startsWith('/profile') && !pathname.startsWith('/exchange')
  
  if (!shouldShowBackground) {
    return null
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Vector Landing Page Full */}
      <div 
        className="absolute w-full min-h-screen"
        style={{
          left: '0px',
          top: '0px',
          transform: `translateY(${0.1}px) scaleY(0.75)`,
          transformOrigin: 'top',
        }}
      >
        <Image
          src="/landing_page/vector landing page.svg"
          alt=""
          width={1080}
          height={840}
          className="w-full h-full object-cover opacity-100"
          priority
        />
      </div>
    </div>
  )
}