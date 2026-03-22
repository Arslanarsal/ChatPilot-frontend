'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { getAccessToken, setTokens, clearTokens, isTokenExpired } from '@/lib/auth'
import { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  signup: (phone: string, password: string, company_name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    const token = getAccessToken()
    if (!token || isTokenExpired(token)) {
      setLoading(false)
      return
    }
    try {
      const res = await api.get('/auth/me')
      setUser(res.data)
    } catch {
      clearTokens()
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (phone: string, password: string) => {
    const res = await api.post('/auth/login', { phone, password })
    const tokens = res.data
    setTokens(tokens.access_token, tokens.refresh_token)
    await fetchUser()
    router.push('/dashboard')
  }

  const signup = async (phone: string, password: string, company_name: string) => {
    const res = await api.post('/auth/signup', { phone, password, company_name })
    const tokens = res.data
    setTokens(tokens.access_token, tokens.refresh_token)
    await fetchUser()
    router.push('/setup')
  }

  const logout = () => {
    clearTokens()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
