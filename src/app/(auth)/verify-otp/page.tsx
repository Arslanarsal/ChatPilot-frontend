'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import { getErrorMessage } from '@/lib/error'
import { Button } from '@/components/ui/button'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [phone, setPhone] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('reset_phone')
    if (!stored) {
      router.push('/forgot-password')
      return
    }
    setPhone(stored)
    inputRefs.current[0]?.focus()
  }, [router])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setError('')

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (digit && index === 5 && newOtp.every(d => d)) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const digits = pasted.split('')
      setOtp(digits)
      inputRefs.current[5]?.focus()
      handleSubmit(pasted)
    }
  }

  const handleSubmit = useCallback(async (otpString?: string) => {
    const code = otpString || otp.join('')
    if (code.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { phone, otp: code })
      sessionStorage.setItem('reset_otp', code)
      router.push('/reset-password')
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Invalid or expired OTP'))
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }, [otp, phone, router])

  const handleResend = async () => {
    if (resendCooldown > 0) return
    try {
      await api.post('/auth/forgot-password', { phone })
      setResendCooldown(60)
      setError('')
    } catch {
      setError('Failed to resend OTP')
    }
  }

  if (!phone) return null

  return (
    <div>
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </div>
        <span className="text-2xl font-bold text-gradient">ChatPilot</span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Verify Code</h2>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to your WhatsApp
          <span className="block text-foreground font-medium mt-1">+{phone}</span>
        </p>
      </div>

      <div className="space-y-6">
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

        {/* OTP Input Grid */}
        <div className="flex justify-center gap-3" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={el => { inputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none
                ${digit ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white'}
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
            />
          ))}
        </div>

        <Button
          onClick={() => handleSubmit()}
          disabled={loading || otp.some(d => !d)}
          className="w-full h-12 rounded-xl gradient-primary hover:opacity-90 text-white font-semibold text-base shadow-glow transition-all duration-200 active:scale-[0.98]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Verifying...
            </div>
          ) : 'Verify Code'}
        </Button>

        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`font-semibold transition-colors ${resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:text-emerald-700'}`}
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </p>
          <p className="text-sm text-muted-foreground">
            <Link href="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
