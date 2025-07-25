"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { qnaService, Question, Comment } from "@/services/qna.service"
import { useAuthContext } from "@/contexts/AuthContext"

// Mock answers data - replace with actual API call
const mockAnswers: Comment[] = [
  {
    id: 1,
    username: "Courier Girl",
    date_added: "2025-07-20T00:00:00Z",
    body: "Saya menerapkan algoritme Vehicle Routing Problem (VRP) sederhana dan memanfaatkan data live traffic API. Dengan pooling ke beberapa agen dan scheduling pickups di jam off-peak, biaya bahan bakar bisa ditekan hingga 20% sekaligus mempercepat waktu pengumpulan.",
    thumbs_up_count: 40
  },
  {
    id: 2,
    username: "Courier Guy",
    date_added: "2025-07-20T00:00:00Z",
    body: "Gunakan model cost-sharing antar agen dalam zona yang sama, lalu aktifkan crowdshipping untuk order kecil. Integrasi Google Maps API memungkinkan dynamic rerouting saat kemacetan. Pastikan kendaraan sesuai volume rata-rata order harian untuk efisiensi maksimal.",
    thumbs_up_count: 40
  },
  {
    id: 3,
    username: "Eco Manager",
    date_added: "2025-07-20T00:00:00Z",
    body: "Kelompokkan agen berdasarkan cluster zona, lalu terapkan threshold minimum 5 L sebelum trip. Jadwalkan pickups dua slot seminggu dan perbaiki estimasi pickup window. Hasilnya: biaya operasional turun 15%, sekaligus meningkatkan kepuasan karena jadwal lebih akurat.",
    thumbs_up_count: 40
  }
]

export default function QnADetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = Number(params.id)
  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)
  const [error, setError] = useState("")
  const [newAnswer, setNewAnswer] = useState("")
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [likingAnswers, setLikingAnswers] = useState<Set<number>>(new Set())
  const [closingQuestion, setClosingQuestion] = useState(false)
  const { isAuthenticated } = useAuthContext()

  // Helper functions for status
  const getStatusColor = (status: string) => {
    return status === "closed" ? 'bg-red-500' : 'bg-green-500'
  }

  const getStatusText = (status: string) => {
    return status === "closed" ? 'Closed' : 'Open'
  }

  const isQuestionClosed = (status: string) => {
    return status === "closed"
  }

  // Fetch comments function
  const fetchComments = useCallback(async () => {
    setLoadingComments(true)
    try {
      console.log('Fetching comments for question ID:', questionId)
      const response = await qnaService.getQuestionComments(questionId)
      console.log('Comments response:', response)
      
      if (response.comments && Array.isArray(response.comments)) {
        setAnswers(response.comments)
      } else {
        // Fallback to mock data if API fails
        console.log('No comments found, using mock data')
        setAnswers(mockAnswers)
      }
    } catch (err: unknown) {
      console.error('Error fetching comments:', err)
      // Use mock data as fallback
      console.log('Using mock data as fallback')
      setAnswers(mockAnswers)
    } finally {
      setLoadingComments(false)
    }
  }, [questionId])

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        console.log('Fetching question with ID:', questionId)
        const response = await qnaService.getQuestionById(questionId)
        console.log('Question response:', response)
        setQuestion(response)
      } catch (err: unknown) {
        console.error('Error fetching question:', err)
        const error = err as Error
        setError(error.message || "Failed to fetch question details")
      } finally {
        setLoading(false)
      }
    }

    if (questionId && !isNaN(questionId)) {
      fetchQuestion()
      fetchComments()
    } else {
      setError("Invalid question ID")
      setLoading(false)
      setLoadingComments(false)
    }
  }, [questionId, fetchComments])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Handle answer submission
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      alert('Please login to post answers')
      return
    }

    if (!newAnswer.trim()) {
      return
    }

    if (question && isQuestionClosed(question.status)) {
      alert('This question is closed and cannot accept new answers')
      return
    }

    setSubmittingAnswer(true)
    
    try {
      console.log('Submitting answer:', { questionId, body: newAnswer.trim() })
      
      // Call the real API to submit answer
      const response = await qnaService.submitAnswer(questionId, newAnswer.trim())
      console.log('Answer submitted successfully:', response)
      
      // Refresh the comments/answers after successful submission
      await fetchComments()
      setNewAnswer("")
    } catch (error: unknown) {
      console.error('Error submitting answer:', error)
      const axiosError = error as { response?: { data?: { message?: string; detail?: string } } }
      const errorMessage = axiosError.response?.data?.message || axiosError.response?.data?.detail || 'Failed to submit answer. Please try again.'
      alert(errorMessage)
    } finally {
      setSubmittingAnswer(false)
    }
  }

  // Handle like answer
  const handleLikeAnswer = async (answerId: number) => {
    if (!isAuthenticated) {
      alert('Please login to like answers')
      return
    }

    if (likingAnswers.has(answerId)) return

    setLikingAnswers(prev => new Set(prev).add(answerId))
    
    try {
      await qnaService.thumbsUpComment(answerId)
      
      // Update local state
      setAnswers(prev => prev.map(answer => 
        answer.id === answerId 
          ? { ...answer, thumbs_up_count: answer.thumbs_up_count + 1 }
          : answer
      ))
    } catch (error) {
      console.error('Error liking answer:', error)
      alert('Failed to like answer. Please try again.')
    } finally {
      setLikingAnswers(prev => {
        const newSet = new Set(prev)
        newSet.delete(answerId)
        return newSet
      })
    }
  }

  // Handle close question
  const handleCloseQuestion = async () => {
    if (!isAuthenticated) {
      alert('Please login to close questions')
      return
    }

    if (!question) return

    if (!confirm('Are you sure you want to close this question?')) return

    setClosingQuestion(true)
    
    try {
      await qnaService.closeQuestion(questionId)
      // Update local state to reflect closed status
      setQuestion(prev => prev ? { ...prev, status: "closed" } : null)
    } catch (error) {
      console.error('Error closing question:', error)
      alert('Failed to close question. Please try again.')
    } finally {
      setClosingQuestion(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-10 relative overflow-hidden bg-gradient-to-br from-teal-50 to-green-50">
        <div className="container mx-auto px-4 py-8 relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading question details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="min-h-screen pt-10 relative overflow-hidden bg-gradient-to-br from-teal-50 to-green-50">
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
    <div className="min-h-screen pt-10 relative overflow-hidden bg-gradient-to-br from-teal-50 to-green-50">
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
            <Link href="/community/qna" className="text-white hover:text-gray-200 transition-colors">
              Q&A
            </Link>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-white font-medium">QnA Discussion</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            QnA Discussion
          </h1>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto relative z-20">
          {/* Question Card */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mb-8 ${
            isQuestionClosed(question.status) ? 'opacity-70' : ''
          }`}>
            {isQuestionClosed(question.status) && (
              <div className="absolute inset-0 bg-gray-900/20 rounded-xl pointer-events-none"></div>
            )}
            
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#04BB84] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {question.username && question.username.length >= 2 
                      ? question.username.substring(0, 2).toUpperCase()
                      : question.username?.charAt(0)?.toUpperCase() || 'U'
                    }
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{question.username || 'Unknown User'}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{formatDate(question.date_added)}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {question.category}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-600 rounded-full">
                      System
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status Badge and Close Button */}
              <div className="flex items-center gap-3">
                {/* Close Button - Only show if question is not closed and user is authenticated */}
                {!isQuestionClosed(question.status) && isAuthenticated && (
                  <button
                    onClick={handleCloseQuestion}
                    disabled={closingQuestion}
                    className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {closingQuestion ? 'Closing...' : 'Close Question'}
                  </button>
                )}
                
                {/* Status Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(question.status)}`}>
                  {getStatusText(question.status)}
                </div>
              </div>
            </div>

            {/* Question Title and Body */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {question.title}
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {question.body}
            </p>

            {/* Question Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <span>{answers.length}</span>
                <span>replies</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{question.thumbs_up_count}</span>
                <span>likes</span>
              </div>
            </div>
          </div>

          {/* Answer Form - Only show if question is not closed */}
          {!isQuestionClosed(question.status) && (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Answer</h3>
              
              {isAuthenticated ? (
                <form onSubmit={handleSubmitAnswer}>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#04BB84] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">CR</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={newAnswer}
                        onChange={(e) => setNewAnswer(e.target.value)}
                        placeholder="Enter your answer..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04BB84] focus:border-transparent"
                        disabled={submittingAnswer}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingAnswer || !newAnswer.trim()}
                      className="bg-[#04BB84] hover:bg-[#039970] text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please login to post an answer</p>
                  <button className="bg-[#04BB84] hover:bg-[#039970] text-white px-6 py-2 rounded-lg transition-colors">
                    Login
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Answers Section */}
          {loadingComments ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04BB84] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading answers...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => (
                <div key={answer.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">
                        {answer.username && answer.username.length >= 2 
                          ? answer.username.substring(0, 2).toUpperCase()
                          : answer.username?.charAt(0)?.toUpperCase() || 'U'
                        }
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">{answer.username}</p>
                          <p className="text-sm text-gray-500">{formatDate(answer.date_added)}</p>
                        </div>
                        
                        <button
                          onClick={() => handleLikeAnswer(answer.id)}
                          disabled={likingAnswers.has(answer.id)}
                          className="flex items-center gap-1 px-3 py-1 text-gray-500 hover:text-[#04BB84] hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.921.405-.921.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          <span className="text-sm font-medium">{answer.thumbs_up_count}</span>
                        </button>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {answer.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 text-[#04BB84] hover:bg-[#04BB84] hover:text-white rounded-lg transition-colors border border-[#04BB84] mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Q&A
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
