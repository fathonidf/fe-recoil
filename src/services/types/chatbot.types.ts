export interface ChatMessage {
  id: number
  content: string
  is_user: boolean
  timestamp: string
}

export interface ChatSession {
  session_id: string
  created_at: string
  message_count?: number
  preview?: string
  is_current?: boolean
}

export interface CurrentSession {
  session_id: string
  created_at: string
}

export interface ChatHistoryResponse {
  status: string
  current_session: CurrentSession
  messages: ChatMessage[]
  all_sessions: ChatSession[]
}

export interface SendChatRequest {
  message: string
}

export interface SendChatResponse {
  status: string
  markdown_content: string
  tokens_used: number
}

export interface ChatbotStats {
  total_sessions: number
  total_messages: number
  active_session_id?: string
}