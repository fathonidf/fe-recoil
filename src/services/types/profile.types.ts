export interface ProfileUpdateRequest {
  username?: string
  email?: string
  phone_number?: string
  alamat?: string
  gender?: string
  latitude?: number
  longitude?: number
  address_id?: string
}

export interface ProfileStats {
  totalPoints: number
  totalTransactions: number
  monthlyPoints: number
  level: string
}