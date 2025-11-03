// Card related types
export interface CardData {
  id: string
  name: string
  issueDate: string
  email?: string
  type?: "Standard" | "Premium"
  avatarUrl?: string
  healthScore?: number
}

export interface HealthData {
  encryptedData: string
  dataHash: string
  timestamp: string
}

// API response types
export interface RegisterMemberResponse {
  success: boolean
  memberId: string
  cardUrl: string
  error?: string
}

export interface HealthDataResponse {
  success: boolean
  memberId: string
  dataHash?: string
  timestamp?: string
  hasData?: boolean
  error?: string
}
