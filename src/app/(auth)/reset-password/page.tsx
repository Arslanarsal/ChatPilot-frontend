'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { getErrorMessage } from '@/lib/error'
import { isStrongPassword } from '@/lib/password'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { PasswordStrength } from '@/components/auth/password-strength'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  useEffect(() => {
    const storedPhone = sessionStorage.getItem('reset_phone')
    const storedOtp = sessionStorage.getItem('reset_otp')
    if (!storedPhone || !storedOtp) {
      router.push('/forgot-password')
      return
    }
    setPhone(storedPhone)
    setOtp(storedOtp)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isStrongPassword(password)) {
      setError('Password must contain 8+ characters with uppercase, lowercase, number, and special character')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', {
        phone,
        otp,
        new_password: password,
      })
      sessionStorage.removeItem('reset_phone')
      sessionStorage.removeItem('reset_otp')
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2000)
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to reset password'))
    } finally {
      setLoading(false)
    }
  }

  if (!phone) return null

  if (success) {
    return (
      <div>
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <span className="text-2xl font-bold text-gradient">ChatPilot</span>
        </div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </motion.div>
          <h3 className="text-xl font-bold text-foreground mb-2">Password Reset!</h3>
          <p className="text-sm text-muted-foreground">Redirecting you to login...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
        <span className="text-2xl font-bold text-gradient">ChatPilot</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">New Password</h2>
        <p className="text-muted-foreground">Create a new password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">New password</Label>
          <PasswordInput
            id="password"
            placeholder="Create a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onSuggest={pw => { setPassword(pw); setConfirmPassword(pw) }}
            suggest
            required
            className="h-12 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
          />
          <PasswordStrength value={password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="h-12 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
          />
          {confirmPassword && password && confirmPassword !== password && (
            <p className="text-xs text-red-600">Passwords don&apos;t match</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full h-12 rounded-xl gradient-primary hover:opacity-90 text-white font-semibold text-base shadow-glow transition-all duration-200 active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Resetting...
            </div>
          ) : 'Reset Password'}
        </Button>

        <p className="text-center text-sm text-muted-foreground pt-2">
          <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
            Back to login
          </Link>
        </p>
      </form>
    </div>
  )
}
