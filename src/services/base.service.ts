import apiClient from '@/lib/axios'
import { AxiosResponse, AxiosRequestConfig } from 'axios'

export interface APIError {
  message: string
  status: number
  details?: unknown
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  status?: number
}

interface ErrorResponse {
  response?: {
    status?: number
    data?: {
      message?: string
      error?: string
      detail?: string
    }
  }
  message?: string
}

export abstract class BaseService {
  protected async handleRequest<T>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await request()
      return {
        success: true,
        data: response.data,
        status: response.status
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string; error?: string; detail?: string } }; message?: string }
      return {
        success: false,
        error: this.extractErrorMessage(err),
        status: err.response?.status || 500
      }
    }
  }

  protected extractErrorMessage(error: unknown): string {
    const err = error as ErrorResponse
    if (err.response?.data?.message) {
      return err.response.data.message
    }
    if (err.response?.data?.error) {
      return err.response.data.error
    }
    if (err.response?.data?.detail) {
      return err.response.data.detail
    }
    if (err.message) {
      return err.message
    }
    return 'An unexpected error occurred'
  }

  protected get<T>(url: string, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    return this.handleRequest(() => apiClient.get<T>(url, config))
  }

  protected post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    return this.handleRequest(() => apiClient.post<T>(url, data, config))
  }

  protected put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    return this.handleRequest(() => apiClient.put<T>(url, data, config))
  }

  protected patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    return this.handleRequest(() => apiClient.patch<T>(url, data, config))
  }

  protected delete<T>(url: string, config?: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    return this.handleRequest(() => apiClient.delete<T>(url, config))
  }
}