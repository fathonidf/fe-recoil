import apiClient from '@/lib/axios'

export interface Question {
  id: number
  username: string
  date_added: string
  title: string
  body: string
  category: string
  thumbs_up_count: number
  is_closed: boolean
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
    } catch (error: any) {
      if (error.message === 'Question not found') {
        throw error
      }
      throw new Error('Failed to fetch question details')
    }
  },

  // Create a new question
  createQuestion: async (questionData: CreateQuestionData): Promise<any> => {
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
  submitAnswer: async (questionId: number, body: string): Promise<any> => {
    try {
      console.log('Submitting answer with data:', { questionId, body })
      
      const response = await apiClient.post(`/community/qna/${questionId}/comment/`, {
        body: body.trim()
      })
      
      console.log('Submit answer response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Submit answer error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        endpoint: `/community/qna/${questionId}/comment/`
      })
      throw error
    }
  },

  // Like/thumbs up a question
  thumbsUpQuestion: async (questionId: number): Promise<any> => {
    const response = await apiClient.post(`/community/qna/comment/${questionId}/thumbs-up/`)
    return response.data
  },

  // Like/thumbs up a comment/answer
  thumbsUpComment: async (commentId: number): Promise<any> => {
    const response = await apiClient.post(`/community/qna/comment/${commentId}/thumbs-up/`)
    return response.data
  },

  // Close a question
  closeQuestion: async (questionId: number): Promise<any> => {
    const response = await apiClient.post(`/community/qna/${questionId}/close/`)
    return response.data
  }
}
