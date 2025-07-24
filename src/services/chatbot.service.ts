import { BaseService, ServiceResponse } from './base.service'
import {
  SendChatRequest,
  SendChatResponse,
  ChatHistoryResponse,
  ChatbotStats
} from './types'

export class ChatbotService extends BaseService {
  private static instance: ChatbotService
  
  static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService()
    }
    return ChatbotService.instance
  }

  /**
   * Send a chat message to the bot
   */
  async sendMessage(message: string): Promise<ServiceResponse<SendChatResponse>> {
    const requestData: SendChatRequest = { message }
    return this.post<SendChatResponse>('/chatbot/chat/', requestData)
  }

  /**
   * Get chat history and all sessions
   */
  async getChatHistory(): Promise<ServiceResponse<ChatHistoryResponse>> {
    return this.get<ChatHistoryResponse>('/chatbot/history/')
  }

  /**
   * Get statistics about chatbot usage
   */
  async getChatbotStats(): Promise<ServiceResponse<ChatbotStats>> {
    return this.get<ChatbotStats>('/chatbot/stats/')
  }

  /**
   * Create a new chat session
   */
  async createNewSession(): Promise<ServiceResponse<{ session_id: string }>> {
    return this.post<{ session_id: string }>('/chatbot/session/')
  }

  /**
   * Switch to a specific session
   */
  async switchSession(sessionId: string): Promise<ServiceResponse<ChatHistoryResponse>> {
    return this.post<ChatHistoryResponse>(`/chatbot/session/${sessionId}/switch/`)
  }

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId: string): Promise<ServiceResponse<void>> {
    return this.delete<void>(`/chatbot/session/${sessionId}/`)
  }

  /**
   * Clear current session messages
   */
  async clearCurrentSession(): Promise<ServiceResponse<void>> {
    return this.post<void>('/chatbot/session/clear/')
  }
}

// Export singleton instance
export const chatbotService = ChatbotService.getInstance()