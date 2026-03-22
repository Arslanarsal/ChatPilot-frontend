import axios from 'axios'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => {
    const data = response.data
    if (data && typeof data === 'object' && 'data' in data) {
      response.data = data.data
    }
    return response
  },
  async error => {
    const originalRequest = error.config
    const url = originalRequest?.url || ''

    // Skip token refresh for auth endpoints — let the page handle the error directly
    const isAuthEndpoint = url.includes('/auth/login') ||
      url.includes('/auth/signup') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/verify-otp') ||
      url.includes('/auth/reset-password')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken },
          )
          const tokens = res.data?.data || res.data
          setTokens(tokens.access_token, tokens.refresh_token)
          originalRequest.headers.Authorization = `Bearer ${tokens.access_token}`
          return api(originalRequest)
        } catch {
          clearTokens()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        }
      } else {
        clearTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
