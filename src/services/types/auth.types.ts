export interface User {
  id: number
  email: string
  username: string
  phone_number: string
  points: number
  wallet: string
  alamat: string
  email_verified: boolean
  profile_picture: string | null
  is_oauth_user: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  tokens: {
    access: string
    refresh: string
  }
  user: User
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
  username: string
  phone_number: string
}

export interface RegisterResponse {
  message: string
  user: User
}