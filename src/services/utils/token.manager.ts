import Cookies from 'js-cookie'

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private static readonly ACCESS_TOKEN_EXPIRY = 1 // 1 day
  private static readonly REFRESH_TOKEN_EXPIRY = 7 // 7 days

  static setTokens(accessToken: string, refreshToken: string): void {
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const
    }

    Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, {
      ...cookieOptions,
      expires: this.ACCESS_TOKEN_EXPIRY
    })

    Cookies.set(this.REFRESH_TOKEN_KEY, refreshToken, {
      ...cookieOptions,
      expires: this.REFRESH_TOKEN_EXPIRY
    })
  }

  static getAccessToken(): string | undefined {
    return Cookies.get(this.ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | undefined {
    return Cookies.get(this.REFRESH_TOKEN_KEY)
  }

  static setAccessToken(accessToken: string): void {
    const cookieOptions = {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: this.ACCESS_TOKEN_EXPIRY
    }

    Cookies.set(this.ACCESS_TOKEN_KEY, accessToken, cookieOptions)
  }

  static clearTokens(): void {
    Cookies.remove(this.ACCESS_TOKEN_KEY)
    Cookies.remove(this.REFRESH_TOKEN_KEY)
  }

  static isAuthenticated(): boolean {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    return !!(accessToken || refreshToken)
  }
}