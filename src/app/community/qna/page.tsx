"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { qnaService, Question } from "@/services/qna.service"
import { useAuthContext } from "@/contexts/AuthContext"

export default function QnAPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("Explore")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Questions")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [likingQuestions, setLikingQuestions] = useState<Set<number>>(new Set())
  const [closingQuestions, setClosingQuestions] = useState<Set<number>>(new Set())
  const { isAuthenticated } = useAuthContext()

  const tabs = [
    "Explore",
    "My Questions"
  ]

  const categories = [
    "All Questions",
    "Kualitas Limbah",
    "Harga Limbah", 
    "Recoil",
    "Lainnya"
  ]

  // Fetch questions based on filter
  const fetchQuestions = async (filter: string, category: string = "All Questions") => {
    setLoading(true)
    setError("")
    try {
      let response
      if (filter === "My Questions" && isAuthenticated) {
        response = await qnaService.getMyQuestions()
      } else if (category !== "All Questions") {
        response = await qnaService.getQuestionsByCategory(category)
      } else {
        response = await qnaService.getAllQuestions()
      }
      console.log('Fetched questions:', response.questions)
      setQuestions(response.questions)
    } catch (err: any) {
      setError(err.message || "Failed to fetch questions")
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  // Load questions on component mount and when filter changes
  useEffect(() => {
    if (activeTab === "My Questions") {
      fetchQuestions("My Questions")
    } else {
      fetchQuestions("Explore", selectedCategory)
    }
  }, [activeTab, selectedCategory, isAuthenticated])

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSelectedCategory("All Questions")
  }

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  // Filter questions based on search query
  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    question.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle create question
  const handleCreateQuestion = () => {
    router.push('/community/qna/create')
  }

  // Handle question click to show details
  const handleQuestionClick = (questionId: number) => {
    router.push(`/community/qna/${questionId}`)
  }

  // Handle like/thumbs up
  const handleThumbsUp = async (questionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to like questions')
      return
    }

    if (likingQuestions.has(questionId)) return

    setLikingQuestions(prev => new Set(prev).add(questionId))
    
    try {
      await qnaService.thumbsUpQuestion(questionId)
      // Refresh the questions list to get updated like count
      if (activeTab === "My Questions") {
        await fetchQuestions("My Questions")
      } else {
        await fetchQuestions("Explore", selectedCategory)
      }
    } catch (error) {
      console.error('Error liking question:', error)
      alert('Failed to like question. Please try again.')
    } finally {
      setLikingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  // Handle close question
  const handleCloseQuestion = async (questionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to close questions')
      return
    }

    if (closingQuestions.has(questionId)) return

    if (!confirm('Are you sure you want to close this question?')) return

    setClosingQuestions(prev => new Set(prev).add(questionId))
    
    try {
      await qnaService.closeQuestion(questionId)
      
      // Update local state instead of just refreshing
      setQuestions(prev => prev.map(question => 
        question.id === questionId 
          ? { ...question, is_closed: true }
          : question
      ))
    } catch (error) {
      console.error('Error closing question:', error)
      alert('Failed to close question. Please try again.')
    } finally {
      setClosingQuestions(prev => {
        const newSet = new Set(prev)
        newSet.delete(questionId)
        return newSet
      })
    }
  }

  // Get status color
  const getStatusColor = (isClosed: boolean) => {
    return isClosed ? 'bg-red-500' : 'bg-green-500'
  }

  // Get status text
  const getStatusText = (isClosed: boolean) => {
    return isClosed ? 'Closed' : 'Open'
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
            <span className="text-white font-medium">Q&A</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            Ask the Community
          </h1>
          <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
            Post your questions, share expertise, and get answers on all things liquid-waste recycling.
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

        {/* Search and Filter Section */}
        <div className="mb-8 relative z-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1 bg-white/90 backdrop-blur-sm rounded-lg border border-white/20">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#04BB84] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#04BB84]/50 text-[#04BB84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BB84] focus:border-transparent bg-transparent backdrop-blur-sm text-lg"
                />
              </div>

              {/* Category Filter - Show only on Explore tab */}
              {activeTab === "Explore" && (
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-3 border border-[#04BB84]/50 text-[#04BB84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#04BB84] focus:border-transparent bg-white/90 backdrop-blur-sm text-lg"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              )}

              {/* Add Question Button */}
              {isAuthenticated && (
                <button
                  onClick={handleCreateQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-[#04BB84] hover:bg-[#039970] text-white rounded-lg transition-colors font-medium text-lg whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Question
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto relative z-10">
          {!isAuthenticated && activeTab === "My Questions" ? (
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
                You need to be logged in to view and manage your questions.
              </p>
            </div>
          ) : loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading questions...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button 
                onClick={() => activeTab === "My Questions" ? fetchQuestions("My Questions") : fetchQuestions("Explore", selectedCategory)}
                className="bg-[#04BB84] hover:bg-[#039970] text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto mb-8">
                <div className="w-24 h-24 bg-[#04BB84] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
                {activeTab === "My Questions" ? "Ask Your First Question" : "No Questions Found"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {activeTab === "My Questions" 
                  ? "Start your journey by asking the community for help and advice."
                  : "No questions match your search criteria. Try a different search or category."
                }
              </p>
              {activeTab === "My Questions" && (
                <button 
                  onClick={handleCreateQuestion}
                  className="bg-[#04BB84] hover:bg-[#039970] text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
                >
                  Ask a Question
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <div 
                  key={question.id} 
                  onClick={() => handleQuestionClick(question.id)}
                  className={`bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1 group relative ${
                    question.is_closed ? 'opacity-60' : ''
                  }`}
                >
                  {question.is_closed && (
                    <div className="absolute inset-0 bg-gray-900/10 pointer-events-none rounded-lg"></div>
                  )}
                  <div className="p-6">
                    {/* Header with Profile and Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#04BB84] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {question.username && question.username.length >= 2 
                              ? question.username.substring(0, 2).toUpperCase()
                              : question.username?.charAt(0)?.toUpperCase() || 'U'
                            }
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold text-sm">{question.username || 'Unknown User'}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{formatDate(question.date_added)}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {question.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(question.is_closed)}`}>
                        {getStatusText(question.is_closed)}
                      </div>
                    </div>

                    {/* Question Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#04BB84] transition-colors">
                      {question.title}
                    </h3>

                    {/* Question Body */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {question.body.length > 200 ? `${question.body.substring(0, 200)}...` : question.body}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => handleThumbsUp(question.id, e)}
                          disabled={likingQuestions.has(question.id)}
                          className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <span className="text-sm">{question.thumbs_up_count}</span>
                          <svg 
                            className={`w-4 h-4 transition-colors ${likingQuestions.has(question.id) ? 'animate-pulse' : ''}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {question.replies_count !== undefined && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <span className="text-sm">{question.replies_count}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Close button for own questions */}
                      {activeTab === "My Questions" && !question.is_closed && (
                        <button
                          onClick={(e) => handleCloseQuestion(question.id, e)}
                          disabled={closingQuestions.has(question.id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors disabled:opacity-50"
                        >
                          {closingQuestions.has(question.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              <span>Closing...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Close
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
