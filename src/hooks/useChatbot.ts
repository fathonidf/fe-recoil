import { useState, useCallback, useEffect } from 'react'
import { 
  chatbotService, 
  ChatMessage, 
  ChatSession
} from '@/services'

interface ChatbotState {
  isLoading: boolean
  isSending: boolean
  isLoadingHistory: boolean
  messages: ChatMessage[]
  sessions: ChatSession[]
  currentSessionId: string | null
  error: string | null
}

export function useChatbot() {
  const [chatbotState, setChatbotState] = useState<ChatbotState>({
    isLoading: false,
    isSending: false,
    isLoadingHistory: false,
    messages: [],
    sessions: [],
    currentSessionId: null,
    error: null
  })

  /**
   * Load chat history and sessions
   */
  const loadChatHistory = useCallback(async () => {
    setChatbotState(prev => ({ ...prev, isLoadingHistory: true, error: null }))
    
    try {
      const response = await chatbotService.getChatHistory()
      
      if (response.success && response.data) {
        setChatbotState(prev => ({
          ...prev,
          messages: response.data!.messages,
          sessions: response.data!.all_sessions,
          isLoadingHistory: false
        }))
        
        return { success: true, data: response.data }
      } else {
        setChatbotState(prev => ({
          ...prev,
          error: response.error || 'Failed to load chat history',
          isLoadingHistory: false
        }))
        return { success: false, error: response.error }
      }
    } catch {
      setChatbotState(prev => ({
        ...prev,
        error: 'Failed to load chat history',
        isLoadingHistory: false
      }))
      return { success: false, error: 'Failed to load chat history' }
    }
  }, [])

  /**
   * Send a message to the chatbot
   */
  const sendMessage = useCallback(async (message: string) => {
    setChatbotState(prev => ({ ...prev, isSending: true, error: null }))
    
    // Add user message to local state immediately
    const userMessage: ChatMessage = {
      id: Date.now(), // Temporary ID
      content: message,
      is_user: true,
      timestamp: new Date().toISOString()
    }
    
    setChatbotState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }))
    
    try {
      const response = await chatbotService.sendMessage(message)
      
      if (response.success && response.data) {
        // Add bot response to messages
        const botMessage: ChatMessage = {
          id: Date.now() + 1, // Temporary ID
          content: response.data.markdown_content,
          is_user: false,
          timestamp: new Date().toISOString()
        }
        
        setChatbotState(prev => ({
          ...prev,
          messages: [...prev.messages, botMessage],
          isSending: false
        }))
        
        return { success: true, data: response.data }
      } else {
        // Remove the user message if sending failed
        setChatbotState(prev => ({
          ...prev,
          messages: prev.messages.slice(0, -1),
          error: response.error || 'Failed to send message',
          isSending: false
        }))
        return { success: false, error: response.error }
      }
    } catch {
      // Remove the user message if sending failed
      setChatbotState(prev => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
        error: 'Failed to send message',
        isSending: false
      }))
      return { success: false, error: 'Failed to send message' }
    }
  }, [])

  /**
   * Create a new chat session
   */
  const createNewSession = useCallback(async () => {
    setChatbotState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await chatbotService.createNewSession()
      
      if (response.success) {
        // Reload chat history to get the new session
        await loadChatHistory()
        return { success: true }
      } else {
        setChatbotState(prev => ({
          ...prev,
          error: response.error || 'Failed to create new session',
          isLoading: false
        }))
        return { success: false, error: response.error }
      }
    } catch {
      setChatbotState(prev => ({
        ...prev,
        error: 'Failed to create new session',
        isLoading: false
      }))
      return { success: false, error: 'Failed to create new session' }
    }
  }, [loadChatHistory])

  /**
   * Switch to a different session
   */
  const switchSession = useCallback(async (sessionId: string) => {
    setChatbotState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await chatbotService.switchSession(sessionId)
      
      if (response.success && response.data) {
        setChatbotState(prev => ({
          ...prev,
          messages: response.data!.messages,
          sessions: response.data!.all_sessions,
          isLoading: false
        }))
        
        return { success: true }
      } else {
        setChatbotState(prev => ({
          ...prev,
          error: response.error || 'Failed to switch session',
          isLoading: false
        }))
        return { success: false, error: response.error }
      }
    } catch {
      setChatbotState(prev => ({
        ...prev,
        error: 'Failed to switch session',
        isLoading: false
      }))
      return { success: false, error: 'Failed to switch session' }
    }
  }, [])

  /**
   * Delete a session
   */
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      const response = await chatbotService.deleteSession(sessionId)
      
      if (response.success) {
        // Reload chat history to update sessions list
        await loadChatHistory()
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch {
      return { success: false, error: 'Failed to delete session' }
    }
  }, [loadChatHistory])

  /**
   * Clear current session messages
   */
  const clearCurrentSession = useCallback(async () => {
    try {
      const response = await chatbotService.clearCurrentSession()
      
      if (response.success) {
        setChatbotState(prev => ({ ...prev, messages: [] }))
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch {
      return { success: false, error: 'Failed to clear session' }
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setChatbotState(prev => ({ ...prev, error: null }))
  }, [])

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory()
  }, [loadChatHistory])

  return {
    ...chatbotState,
    loadChatHistory,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    clearCurrentSession,
    clearError
  }
}