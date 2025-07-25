"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { blogService, Blog } from "@/services/blog.service"
import { useAuthContext } from "@/contexts/AuthContext"
import SafeImage from "@/components/SafeImage"

export default function BlogPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Explore")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("All Blogs")
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; blogId: number | null; title: string }>({
    show: false,
    blogId: null,
    title: ""
  })
  const [deleting, setDeleting] = useState(false)
  const [likingBlogs, setLikingBlogs] = useState<Set<number>>(new Set())
  const { isAuthenticated } = useAuthContext()

  const tabs = [
    "Explore",
    "My Blog"
  ]

  // Fetch blogs based on filter
  const fetchBlogs = useCallback(async (filter: string) => {
    setLoading(true)
    setError("")
    try {
      let response
      if (filter === "My Blogs" && isAuthenticated) {
        response = await blogService.getMyBlogs()
      } else {
        response = await blogService.getAllBlogs()
      }
      setBlogs(response.blogs)
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || "Failed to fetch blogs")
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Load blogs on component mount and when filter changes
  useEffect(() => {
    fetchBlogs(selectedFilter)
  }, [selectedFilter, isAuthenticated, fetchBlogs])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "My Blog") {
      setSelectedFilter("My Blogs")
    } else {
      setSelectedFilter("All Blogs")
    }
  }

  // Filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.style.display = 'none'
    const fallback = target.parentElement?.querySelector('.fallback-content') as HTMLElement
    if (fallback) {
      fallback.style.display = 'flex'
    }
  }

  // Handle delete blog
  const handleDeleteBlog = async (blogId: number) => {
    setDeleting(true)
    setDeleteError("")
    try {
      await blogService.deleteBlog(blogId)
      // Refresh the blogs list
      await fetchBlogs(selectedFilter)
      setDeleteConfirm({ show: false, blogId: null, title: "" })
    } catch (err: unknown) {
      console.error('Error deleting blog:', err)
      setDeleteError("Failed to delete blog. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  // Handle edit blog
  const handleEditBlog = (blogId: number) => {
    router.push(`/community/blog/edit/${blogId}`)
  }

  // Handle create blog
  const handleCreateBlog = () => {
    router.push('/community/blog/create')
  }

  // Handle blog click to show details
  const handleBlogClick = (blogId: number) => {
    router.push(`/community/blog/${blogId}`)
  }

  // Handle like/thumbs up
  const handleThumbsUp = async (blogId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigation to blog detail page
    
    if (!isAuthenticated) {
      alert('Please login to like posts')
      return
    }

    if (likingBlogs.has(blogId)) return // Prevent double clicking

    setLikingBlogs(prev => new Set(prev).add(blogId))
    
    try {
      await blogService.thumbsUpBlog(blogId)
      // Refresh the blogs list to get updated like count
      await fetchBlogs(selectedFilter)
    } catch (error) {
      console.error('Error liking blog:', error)
      alert('Failed to like post. Please try again.')
    } finally {
      setLikingBlogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(blogId)
        return newSet
      })
    }
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
        {/* Breadcrumbs - positioned at top left */}
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
            <span className="text-white font-medium">Blog</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            EcoBlog: Stories & Tips
          </h1>
          <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
            Dive into member stories, tutorials, and insights on turning liquid waste into value.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 relative z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-sm max-w-6xl mx-auto border border-white/20">
            <div className="grid grid-cols-2 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-center cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#04BB84] text-white shadow-[0_4px_8px_rgba(4,187,132,0.3)] transform translate-y-[-2px] border-b-4 border-[#039970]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#04BB84]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Section - Expanded */}
        <div className="mb-8 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 items-center">
              {/* Expanded Search Bar */}
              <div className="relative flex-1 bg-white/90 backdrop-blur-sm rounded-lg border border-white/20">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#04BB84] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#04BB84]/50 text-[#04BB84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BB84] focus:border-transparent bg-transparent backdrop-blur-sm text-lg"
                />
              </div>

              {/* Add Blog Button - Show when on My Blog tab */}
              {activeTab === "My Blog" && isAuthenticated && (
                <button
                  onClick={handleCreateBlog}
                  className="flex items-center gap-2 px-6 py-3 bg-[#04BB84] hover:bg-[#039970] text-white rounded-lg transition-colors font-medium text-lg whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Blog
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === "Explore" ? (
          /* Blog Posts Grid */
          <div className="max-w-6xl mx-auto relative z-10">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading blogs...</p>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 mb-4">Error: {error}</p>
                <button 
                  onClick={() => fetchBlogs(selectedFilter)}
                  className="bg-[#04BB84] hover:bg-[#039970] text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No blogs found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBlogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    onClick={() => handleBlogClick(blog.id)}
                    className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 group h-80"
                  >
                    <div className="grid grid-cols-2 gap-0 h-full">
                      {/* Left Column - Content */}
                      <div className="p-6 flex flex-col justify-between">
                        {/* Profile Section */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-[#04BB84] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {blog.username && blog.username.length >= 2 
                                ? blog.username.substring(0, 2).toUpperCase()
                                : blog.username?.charAt(0)?.toUpperCase() || 'U'
                              }
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-800 font-semibold text-sm">{blog.username || 'Unknown User'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <button
                                onClick={(e) => handleThumbsUp(blog.id, e)}
                                disabled={likingBlogs.has(blog.id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                              >
                                <span className="text-sm">{blog.thumbs_up_count}</span>
                                <svg 
                                  className={`w-4 h-4 transition-colors ${likingBlogs.has(blog.id) ? 'animate-pulse' : ''}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1">
                          {/* Blog Title */}
                          <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#04BB84] transition-colors line-clamp-2">
                            {blog.title}
                          </h3>

                          {/* Blog Snippet */}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {blog.body.length > 150 ? `${blog.body.substring(0, 150)}...` : blog.body}
                          </p>
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-[#04BB84] text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>{formatDate(blog.date_added)}</span>
                        </div>
                      </div>

                      {/* Right Column - Image */}
                      <div className="relative overflow-hidden">
                        <div className="h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                          {hasValidImage(blog.image_url) && blog.image_url ? (
                            <>
                              <SafeImage
                                src={blog.image_url}
                                alt="Blog post image"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={handleImageError}
                              />
                              <div className="fallback-content absolute inset-0 items-center justify-center" style={{ display: 'none' }}>
                                <div className="text-center">
                                  <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-600 text-sm">Blog Image</p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="fallback-content absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <p className="text-gray-600 text-sm">Blog Image</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* My Blog Content */
          <div className="max-w-6xl mx-auto relative z-10">
            {!isAuthenticated ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto mb-8">
                  <div className="w-24 h-24 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
                  Please Sign In
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  You need to be logged in to view and manage your blog posts.
                </p>
              </div>
            ) : (
              <div>
                {/* My Blogs List */}
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your blogs...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <button 
                      onClick={() => fetchBlogs("My Blogs")}
                      className="bg-[#04BB84] hover:bg-[#039970] text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredBlogs.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto mb-8">
                      <div className="w-24 h-24 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
                      Start Your Blogging Journey
                    </h2>
                    <p className="text-lg text-gray-600 mb-8">
                      Share your eco-friendly stories, tips, and experiences with the community.
                    </p>
                    <button 
                      onClick={handleCreateBlog}
                      className="bg-[#04BB84] hover:bg-[#039970] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredBlogs.map((blog) => (
                      <div 
                        key={blog.id} 
                        onClick={() => handleBlogClick(blog.id)}
                        className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 group"
                      >
                        <div className="grid grid-cols-2 gap-0">
                          {/* Left Column - Content */}
                          <div className="p-6">
                            {/* Profile Section */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-[#04BB84] rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  {blog.username && blog.username.length >= 2 
                                    ? blog.username.substring(0, 2).toUpperCase()
                                    : blog.username?.charAt(0)?.toUpperCase() || 'U'
                                  }
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-800 font-semibold text-sm">{blog.username || 'Unknown User'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <button
                                    onClick={(e) => handleThumbsUp(blog.id, e)}
                                    disabled={likingBlogs.has(blog.id)}
                                    className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                  >
                                    <span className="text-sm">{blog.thumbs_up_count}</span>
                                    <svg 
                                      className={`w-4 h-4 transition-colors ${likingBlogs.has(blog.id) ? 'animate-pulse' : ''}`} 
                                      fill="currentColor" 
                                      viewBox="0 0 20 20"
                                    >
                                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Blog Title */}
                            <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#04BB84] transition-colors">
                              {blog.title}
                            </h3>

                            {/* Blog Snippet */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {blog.body.length > 200 ? `${blog.body.substring(0, 200)}...` : blog.body}
                            </p>

                            {/* Date and Action Buttons */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[#04BB84] text-sm">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span>{formatDate(blog.date_added)}</span>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleEditBlog(blog.id)}
                                  className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Details
                                </button>
                                <button 
                                  onClick={() => setDeleteConfirm({ show: true, blogId: blog.id, title: blog.title })}
                                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Image */}
                          <div className="relative overflow-hidden">
                            <div className="h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center relative overflow-hidden group-hover:bg-gradient-to-br group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                              {hasValidImage(blog.image_url) && blog.image_url ? (
                                <>
                                  <SafeImage
                                    src={blog.image_url}
                                    alt="Blog post image"
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={handleImageError}
                                  />
                                  <div className="fallback-content absolute inset-0 items-center justify-center" style={{ display: 'none' }}>
                                    <div className="text-center">
                                      <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      <p className="text-gray-600 text-sm">Blog Image</p>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="fallback-content absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="w-16 h-16 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-2">
                                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                    <p className="text-gray-600 text-sm">Blog Image</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Blog Post
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete &quot;{deleteConfirm.title}&quot;? This action cannot be undone.
            </p>
            
            {/* Delete Error */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{deleteError}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirm({ show: false, blogId: null, title: "" })
                  setDeleteError("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConfirm.blogId && handleDeleteBlog(deleteConfirm.blogId)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
