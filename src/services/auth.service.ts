import { BaseService, ServiceResponse } from './base.service'
import { TokenManager } from './utils'
import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  User
} from './types'

export class AuthService extends BaseService {
  private static instance: AuthService
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(credentials: LoginRequest): Promise<ServiceResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>('/member/api/login/', credentials)
    
    if (response.success && response.data) {
      const { tokens } = response.data
      TokenManager.setTokens(tokens.access, tokens.refresh)
    }
    
    return response
  }

  async register(data: RegisterRequest): Promise<ServiceResponse<RegisterResponse>> {
    return this.post<RegisterResponse>('/member/api/register/', data)
  }

  async logout(): Promise<ServiceResponse<void>> {
    const refreshToken = TokenManager.getRefreshToken()
    const accessToken = TokenManager.getAccessToken()
    
    let response: ServiceResponse<void> = { success: true }
    
    // Try to call logout API if tokens exist
    if (refreshToken && accessToken) {
      const logoutData: LogoutRequest = { refresh: refreshToken }
      response = await this.post<void>('/member/api/logout/', logoutData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
    }
    
    // Always clear tokens regardless of API response
    TokenManager.clearTokens()
    
    return response
  }

  async refreshToken(): Promise<ServiceResponse<RefreshTokenResponse>> {
    const refreshToken = TokenManager.getRefreshToken()
    
    if (!refreshToken) {
      TokenManager.clearTokens()
      return {
        success: false,
        error: 'No refresh token available'
      }
    }

    const refreshData: RefreshTokenRequest = { refresh: refreshToken }
    const response = await this.post<RefreshTokenResponse>('/member/api/token/refresh/', refreshData)
    
    if (response.success && response.data) {
      TokenManager.setAccessToken(response.data.access)
    } else {
      // Clear tokens if refresh fails
      TokenManager.clearTokens()
    }
    
    return response
  }

  async getProfile(): Promise<ServiceResponse<User>> {
    return this.get<User>('/member/api/profile/')
  }

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated()
  }

  getAccessToken(): string | undefined {
    return TokenManager.getAccessToken()
  }

  getRefreshToken(): string | undefined {
    return TokenManager.getRefreshToken()
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()