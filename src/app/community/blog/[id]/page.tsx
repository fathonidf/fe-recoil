"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { blogService, Blog } from "@/services/blog.service"
import { useAuthContext } from "@/contexts/AuthContext"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = Number(params.id)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [likingBlog, setLikingBlog] = useState(false)
  const { isAuthenticated } = useAuthContext()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        console.log('Fetching blog with ID:', blogId)
        const response = await blogService.getBlogById(blogId)
        console.log('Blog response:', response)
        setBlog(response)
      } catch (err: any) {
        console.error('Error fetching blog:', err)
        setError(err.message || "Failed to fetch blog details")
      } finally {
        setLoading(false)
      }
    }

    if (blogId && !isNaN(blogId)) {
      fetchBlog()
    } else {
      setError("Invalid blog ID")
      setLoading(false)
    }
  }, [blogId])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Check if image URL is valid
  const hasValidImage = (imageUrl?: string | null): boolean => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return false
    }
    const trimmedUrl = imageUrl.trim()
    return trimmedUrl !== '' && trimmedUrl !== 'null' && trimmedUrl !== 'undefined'
  }

  // Handle like/thumbs up
  const handleThumbsUp = async () => {
    if (!isAuthenticated) {
      alert('Please login to like posts')
      return
    }

    if (likingBlog || !blog) return

    setLikingBlog(true)
    
    try {
      await blogService.thumbsUpBlog(blog.id)
      // Refresh the blog to get updated like count
      const updatedBlog = await blogService.getBlogById(blog.id)
      setBlog(updatedBlog)
    } catch (error) {
      console.error('Error liking blog:', error)
      alert('Failed to like post. Please try again.')
    } finally {
      setLikingBlog(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-10 relative overflow-hidden">
        {/* Background blur blobs */}
        <div className="absolute -left-100 top-0 z-0">
          <Image
            src="/landing_page/blur blob.svg"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
        <div className="absolute -right-100 top-0 z-0">
          <Image
            src="/landing_page/blur blob.svg"
            alt=""
            width={1000}
            height={1000}
            className="rotate-180"
          />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen pt-10 relative overflow-hidden">
        {/* Background blur blobs */}
        <div className="absolute -left-100 top-0 z-0">
          <Image
            src="/landing_page/blur blob.svg"
            alt=""
            width={1000}
            height={1000}
          />
        </div>
        <div className="absolute -right-100 top-0 z-0">
          <Image
            src="/landing_page/blur blob.svg"
            alt=""
            width={1000}
            height={1000}
            className="rotate-180"
          />
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={() => router.back()}
              className="bg-[#04BB84] hover:bg-[#039970] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 relative overflow-hidden">
      {/* Background blur blobs */}
      <div className="absolute -left-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
      <div className="absolute -right-100 top-0 z-0">
        <Image
          src="/landing_page/blur blob.svg"
          alt=""
          width={1000}
          height={1000}
          className="rotate-180"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-6 relative z-20">
          <div className="inline-flex items-center space-x-2 text-sm text-white bg-secondary rounded-md px-3 py-2">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                Home
              </Link>
            </div>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <Link href="/community" className="text-white hover:text-gray-200 transition-colors">
              Community
            </Link>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <Link href="/community/blog" className="text-white hover:text-gray-200 transition-colors">
              Blog
            </Link>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-white font-medium">Blog Detail</span>
          </div>
        </div>

        {/* Blog Content */}
        <div className="max-w-4xl mx-auto relative z-20">
          <article className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20">
            {/* Blog Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {blog.title}
              </h1>
              
              {/* Author and Date Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#04BB84] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {blog.username && blog.username.length >= 2 
                        ? blog.username.substring(0, 2).toUpperCase()
                        : blog.username?.charAt(0)?.toUpperCase() || 'U'
                      }
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">{blog.username || 'Unknown User'}</p>
                    <p className="text-gray-600">{formatDate(blog.date_added)}</p>
                  </div>
                </div>
                
                {/* Like Button */}
                <button
                  onClick={handleThumbsUp}
                  disabled={likingBlog}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg 
                    className={`w-6 h-6 transition-colors ${likingBlog ? 'animate-pulse' : ''}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{blog.thumbs_up_count}</span>
                  <span>Likes</span>
                </button>
              </div>
            </header>

            {/* Featured Image */}
            {hasValidImage(blog.image_url) && (
              <div className="mb-8">
                <div className="relative w-full h-96 rounded-lg overflow-hidden">
                  <img
                    src={blog.image_url!}
                    alt="Blog featured image"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {blog.body}
              </div>
            </div>

            {/* Blog Footer */}
            <footer className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Published on {formatDate(blog.date_added)}
                </div>
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 text-[#04BB84] hover:bg-[#04BB84] hover:text-white rounded-lg transition-colors border border-[#04BB84]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blogs
                </button>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </div>
  )
}
