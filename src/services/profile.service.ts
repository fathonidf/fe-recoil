import { BaseService, ServiceResponse } from './base.service'
import { User, ProfileUpdateRequest, ProfileStats } from './types'

export class ProfileService extends BaseService {
  private static instance: ProfileService
  
  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }

  async getProfile(): Promise<ServiceResponse<User>> {
    return this.get<User>('/member/api/profile/')
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<ServiceResponse<User>> {
    return this.patch<User>('/member/api/profile/', data)
  }

  async uploadProfilePicture(file: File): Promise<ServiceResponse<{ profile_picture: string }>> {
    const formData = new FormData()
    formData.append('profile_picture', file)
    
    return this.post<{ profile_picture: string }>('/member/api/profile/picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async getProfileStats(): Promise<ServiceResponse<ProfileStats>> {
    return this.get<ProfileStats>('/member/api/profile/stats/')
  }

  async deleteAccount(): Promise<ServiceResponse<void>> {
    return this.delete<void>('/member/api/profile/')
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance()