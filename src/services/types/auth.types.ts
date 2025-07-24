export interface User {
  id: number
  username: string
  email: string
  phone_number: string
  points: number
  wallet: string
  alamat: string
  profile_picture: string
  is_oauth_user: boolean
  latitude: number
  longitude: number
  address_id: string
  gender: string
  is_agent: boolean
  email_verified: boolean
}

export interface Agent {
  id: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  tokens: {
    refresh: string
    access: string
  }
  user: User
  is_agent: boolean
  agent?: Agent
}

export interface LogoutRequest {
  refresh: string
}

export interface RefreshTokenRequest {
  refresh: string
}

export interface RefreshTokenResponse {
  access: string
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
  username: string
  phone_number: string
  alamat: string
  gender: string
  is_agent?: string // "True" or "False"
  company_name?: string
}

export interface RegisterResponse {
  message: string
  user: User
}