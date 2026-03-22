export interface User {
  id: number
  phone: string
  company_name: string
  company_id: number
  created_at: string
  updated_at: string
  company: Company
}

export interface Company {
  id: number
  name: string
  phone: number
  is_bot_activated: boolean | null
  whatsapp_connection_status: boolean | null
  session_id: string | null
  business_details: BusinessDetails | null
  assistant_id: number | null
}

export interface BusinessDetails {
  description?: string
  industry?: string
  services?: string
  hours?: string
  tone?: string
}

export interface Contact {
  id: number
  name: string | null
  phone: number | null
  whatsapp_profile_name: string | null
  total_messages: number
  is_bot_activated: boolean | null
  last_message_received: string
  messages?: Message[]
}

export interface Message {
  id: number
  contact_id: number
  message: string
  image_url: string | null
  sent_at: string
  author_type: 'human' | 'bot' | 'user_whatsapp'
  message_type: string | null
}

export interface DashboardStats {
  contacts_count: number
  messages_count: number
  bot_messages_count: number
  is_bot_activated: boolean
  whatsapp_connected: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}
