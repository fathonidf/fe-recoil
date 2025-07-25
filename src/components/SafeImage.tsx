"use client"

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export default function SafeImage({ 
  src, 
  alt, 
  fill, 
  className, 
  width, 
  height, 
  priority = false,
  onError 
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // Check if this is an S3 URL that might have issues
  const isS3Url = src.includes('s3.amazonaws.com')
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true)
    if (onError) {
      onError(e)
    }
  }

  // If there's an error or it's a problematic S3 URL, use regular img tag
  if (imageError || isS3Url) {
    return (
        // eslint-disable-next-line
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
        onError={handleError}
      />
    )
  }

  // Otherwise use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
    />
  )
}
