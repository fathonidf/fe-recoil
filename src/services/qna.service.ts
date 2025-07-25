import apiClient from '@/lib/axios'

export interface Question {
  id: number
  username: string
  date_added: string
  title: string
  body: string
  category: string
  thumbs_up_count: number
  status: string  // "closed" or "open"
  replies_count?: number
}

export interface Comment {
  id: number
  username: string
  date_added: string
  body: string
  thumbs_up_count: number
}

export interface QuestionsResponse {
  questions: Question[]
}

export interface CommentsResponse {
  comments: Comment[]
}

export interface CreateQuestionData {
  title: string
  body: string
  category: string
}

export const qnaService = {
  // Get all questions
  getAllQuestions: async (): Promise<QuestionsResponse> => {
    const response = await apiClient.get('/community/qna/')
    return response.data
  },

  // Get user's questions (requires authentication)
  getMyQuestions: async (): Promise<QuestionsResponse> => {
    const response = await apiClient.get('/community/qna/my/')
    return response.data
  },

  // Get questions by category
  getQuestionsByCategory: async (category: string): Promise<QuestionsResponse> => {
    const response = await apiClient.get(`/community/qna/category/${category}/`)
    return response.data
  },

  // Get a single question by ID (simulated by filtering from all questions)
  getQuestionById: async (questionId: number): Promise<Question> => {
    try {
      // Since there's no specific endpoint for individual questions, 
      // we'll get all questions and filter by ID
      const response = await apiClient.get('/community/qna/')
      
      if (response.data && response.data.questions && Array.isArray(response.data.questions)) {
        const question = response.data.questions.find((q: Question) => q.id === questionId)
        if (question) {
          return question
        } else {
          throw new Error('Question not found')
        }
      }
      
      throw new Error('Invalid response format from server')
    } catch (error: unknown) {
      const err = error as Error
      if (err.message === 'Question not found') {
        throw err
      }
      throw new Error('Failed to fetch question details')
    }
  },

  // Create a new question
  createQuestion: async (questionData: CreateQuestionData): Promise<{ success: boolean; question?: Question }> => {
    const response = await apiClient.post('/community/qna/create/', questionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  },

  // Get comments for a question
  getQuestionComments: async (questionId: number): Promise<CommentsResponse> => {
    const response = await apiClient.get(`/community/qna/${questionId}/comments/`)
    return response.data
  },

  // Submit an answer/comment to a question
  submitAnswer: async (questionId: number, body: string): Promise<{ success: boolean; comment?: Comment }> => {
    try {
      console.log('Submitting answer with data:', { questionId, body })
      
      const response = await apiClient.post(`/community/qna/${questionId}/comment/`, {
        body: body.trim()
      })
      
      console.log('Submit answer response:', response.data)
      return response.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown; status?: number } }
      console.error('Submit answer error details:', {
        questionId,
        body,
        status: err.response?.status,
        data: err.response?.data,
        message: (error as Error).message,
        endpoint: `/community/qna/${questionId}/comment/`
      })
      throw error
    }
  },

  // Like/thumbs up a question
  thumbsUpQuestion: async (questionId: number): Promise<{ success: boolean; thumbs_up_count?: number }> => {
    const response = await apiClient.post(`/community/qna/comment/${questionId}/thumbs-up/`)
    return response.data
  },

  // Like/thumbs up a comment/answer
  thumbsUpComment: async (commentId: number): Promise<{ success: boolean; thumbs_up_count?: number }> => {
    const response = await apiClient.post(`/community/qna/comment/${commentId}/thumbs-up/`)
    return response.data
  },

  // Close a question
  closeQuestion: async (questionId: number): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.post(`/community/qna/${questionId}/close/`)
    return response.data
  }
}
