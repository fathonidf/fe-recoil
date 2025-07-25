"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { qnaService, CreateQuestionData } from "@/services/qna.service"
import { useAuthContext } from "@/contexts/AuthContext"

export default function CreateQuestionPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthContext()
  const [formData, setFormData] = useState<CreateQuestionData>({
    title: "",
    body: "",
    category: "recoil"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const categories = [
    { value: "recoil", label: "Recoil" },
    { value: "kualitas limbah", label: "Kualitas Limbah" },
    { value: "harga limbah", label: "Harga Limbah" },
    { value: "lainnya", label: "Lainnya" }
  ]

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login')
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.body.trim()) {
      setError("Title and question body are required")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await qnaService.createQuestion(formData)
      router.push('/community/qna')
    } catch (err: unknown) {
      console.error('Error creating question:', err)
      const axiosError = err as { response?: { data?: { message?: string } } }
      setError(axiosError.response?.data?.message || "Failed to create question. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/community/qna')
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
            <Link href="/community/qna" className="text-white hover:text-gray-200 transition-colors">
              Q&A
            </Link>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
            <span className="text-white font-medium">Ask Question</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold text-[#04BB84] mb-4">
            Ask a Question
          </h1>
          <p className="text-lg italic text-gray-600 max-w-2xl mx-auto">
            Ask your question, share the details, and get expert answers
          </p>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto relative z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your question title..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04BB84] focus:border-transparent text-gray-900 placeholder-gray-500"
                  maxLength={200}
                />
                <div className="mt-1 text-sm text-gray-500">
                  {formData.title.length}/200 characters
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04BB84] focus:border-transparent text-gray-900"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Body */}
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                  Question Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="body"
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  placeholder="Provide detailed information about your question..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04BB84] focus:border-transparent text-gray-900 placeholder-gray-500 resize-vertical"
                />
                <div className="mt-1 text-sm text-gray-500">
                  {formData.body.length} characters (minimum 10)
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-[#04BB84] hover:bg-[#039970] text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !formData.title.trim() || !formData.body.trim() || formData.body.length < 10}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Posting Question...</span>
                    </div>
                  ) : (
                    'Post Question'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
