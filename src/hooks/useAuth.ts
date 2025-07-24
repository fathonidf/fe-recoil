import { useState, useEffect, useCallback } from 'react'
import { authService, User } from '@/services'
import { useRouter } from 'next/navigation'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  })
  const router = useRouter()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated()
      setAuthState(prev => ({
        ...prev,
        isAuthenticated,
        isLoading: false
      }))
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      const response = await authService.login({ email, password })
      
      if (response.success && response.data) {
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          isLoading: false
        })
        
        return { success: true, data: response.data }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return { success: false, error: response.error || 'Login failed' }
      }
    } catch {
      setAuthState(prev => ({ ...prev, isLoading: false }))
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      await authService.logout()
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
      
      router.push('/login')
      return { success: true }
    } catch {
      // Even if logout API fails, clear local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
      
      router.push('/login')
      return { success: false, error: 'Logout failed' }
    }
  }, [router])

  const refreshAuth = useCallback(async () => {
    try {
      const response = await authService.refreshToken()
      if (response.success) {
        setAuthState(prev => ({ ...prev, isAuthenticated: true }))
        return { success: true }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        })
        return { success: false }
      }
    } catch {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      })
      return { success: false }
    }
  }, [])

  const fetchProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile()
      if (response.success && response.data) {
        setAuthState(prev => ({ ...prev, user: response.data || null }))
        return { success: true, data: response.data }
      } else {
        return { success: false, error: response.error || 'Failed to fetch profile.' }
      }
    } catch {
      return { success: false, error: 'Failed to fetch profile.' }
    }
  }, [])

  return {
    ...authState,
    login,
    logout,
    refreshAuth,
    fetchProfile
  }
}