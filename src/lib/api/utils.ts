import { AxiosError } from 'axios'

export interface APIError {
  message: string
  status: number
  details?: unknown
}

export function handleAPIError(error: unknown): APIError {
  if (error instanceof AxiosError) {
    const status = error.response?.status || 500
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.response?.data?.detail ||
                   error.message ||
                   'An unexpected error occurred'
    
    return {
      message,
      status,
      details: error.response?.data
    }
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500
    }
  }
  
  return {
    message: 'An unexpected error occurred',
    status: 500
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401
}

export function isForbiddenError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 403
}

export function isValidationError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 400
}