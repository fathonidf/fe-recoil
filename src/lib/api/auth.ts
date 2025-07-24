import apiClient from '@/lib/axios'
import Cookies from 'js-cookie'

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
  user: {
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
}

export interface LogoutRequest {
  refresh: string
}

export interface RefreshRequest {
  refresh: string
}

export interface RefreshResponse {
  access: string
}

export interface UserProfile {
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

class AuthAPI {
  /**
   * Login user and store tokens in cookies
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/member/api/login/', credentials)
      
      const { tokens } = response.data
      const { access, refresh } = tokens
      
      // Store tokens in cookies
      Cookies.set('access_token', access, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      Cookies.set('refresh_token', refresh, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Logout user and clear tokens from cookies
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refresh_token')
      const accessToken = Cookies.get('access_token')
      
      if (refreshToken && accessToken) {
        await apiClient.post('/member/api/logout/', {
          refresh: refreshToken
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Continue with cleanup even if API call fails
    } finally {
      // Always clear cookies
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = Cookies.get('refresh_token')
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<RefreshResponse>('/member/api/token/refresh/', {
        refresh: refreshToken
      })
      
      const { access } = response.data
      
      // Update access token in cookies
      Cookies.set('access_token', access, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      return response.data
    } catch (error) {
      console.error('Token refresh error:', error)
      // Clear tokens if refresh fails
      Cookies.remove('access_token')
      Cookies.remove('refresh_token')
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = Cookies.get('access_token')
    const refreshToken = Cookies.get('refresh_token')
    return !!(accessToken || refreshToken)
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return Cookies.get('access_token')
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token')
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>('/member/api/profile/')
      return response.data
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  }
}

export const authAPI = new AuthAPI()