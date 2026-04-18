'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const steps = [
  { num: 1, title: 'Business Description', desc: 'Tell us about your business' },
  { num: 2, title: 'Connect WhatsApp', desc: 'Link your WhatsApp number' },
]

export default function SetupPage() {
  const { user } = useAuth()
  const router = useRouter()

  const existingDescription =
    (user?.company?.business_details as { description?: string } | null)?.description || ''

  const [step, setStep] = useState(1)
  const [description, setDescription] = useState(existingDescription)
  const [editing, setEditing] = useState(!existingDescription)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [connectionMode, setConnectionMode] = useState<'choose' | 'qr' | 'pairing'>('choose')
  const [qrUrl, setQrUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [pairingPhone, setPairingPhone] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [loadingPairing, setLoadingPairing] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval>>()
  const companyId = user?.company_id

  useEffect(() => {
    if (user) {
      setDescription(existingDescription)
      setEditing(!existingDescription)
    }
  }, [user, existingDescription])

  const saveBusinessDetails = async () => {
    if (!companyId || !description.trim()) return
    setSaving(true)
    setError('')
    try {
      await api.put(`/companies/${companyId}/business-details`, { description })
      try {
        await api.post(`/companies/${companyId}/generate-prompt`)
      } catch {}
      setEditing(false)
      setStep(2)
    } catch {
      setError('Could not save description. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const proceedToConnect = () => {
    if (!description.trim()) {
      setEditing(true)
      setError('Please add your business description before connecting WhatsApp.')
      return
    }
    setStep(2)
  }

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/companies/${companyId}/connection_status`)
        if (res.data?.state === 'CONNECTED') {
          setConnected(true)
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch {}
    }, 5000)
  }

  const startQrConnection = async () => {
    if (!companyId) return
    setConnectionMode('qr')

    try {
      const statusRes = await api.get(`/companies/${companyId}/connection_status`)
      if (statusRes.data?.state === 'CONNECTED') {
        setConnected(true)
        return
      }
    } catch {}

    try {
      await api.post(`/companies/${companyId}/create_session`)
    } catch {
      try {
        const statusRes = await api.get(`/companies/${companyId}/connection_status`)
        if (statusRes.data?.state === 'CONNECTED') {
          setConnected(true)
          return
        }
      } catch {}
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const statusRes = await api.get(`/companies/${companyId}/connection_status`)
      if (statusRes.data?.state === 'CONNECTED') {
        setConnected(true)
        return
      }
    } catch {}

    setQrUrl(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/get_qr?t=${Date.now()}`)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/companies/${companyId}/connection_status`)
        if (res.data?.state === 'CONNECTED') {
          setConnected(true)
          if (pollRef.current) clearInterval(pollRef.current)
        } else {
          setQrUrl(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/get_qr?t=${Date.now()}`)
        }
      } catch {}
    }, 5000)
  }

  const startPairingConnection = async () => {
    if (!companyId || !pairingPhone.trim()) return
    setLoadingPairing(true)
    setPairingCode('')

    try {
      await api.post(`/companies/${companyId}/create_session`, {
        usePairingCode: true,
        phoneNumber: pairingPhone,
      })
      await new Promise(resolve => setTimeout(resolve, 2500))
      const res = await api.get(`/companies/${companyId}/pairing-code`)
      setPairingCode(res.data?.pairingCode || res.data?.data?.pairingCode || '')
      startPolling()
    } catch {
      setPairingCode('')
    } finally {
      setLoadingPairing(false)
    }
  }

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const hasDescription = Boolean(existingDescription.trim())

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-foreground">Setup Wizard</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasDescription
            ? 'Your business is configured. Connect WhatsApp to go live.'
            : 'Tell us about your business, then connect WhatsApp.'}
        </p>
      </motion.div>

      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.num} className="flex flex-1 items-center">
            <div className="flex flex-1 items-center gap-3">
              <motion.div
                animate={{
                  scale: step === s.num ? 1.1 : 1,
                  backgroundColor: step >= s.num ? 'rgb(16,185,129)' : 'rgb(226,232,240)',
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              >
                {step > s.num ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <span className={step === s.num ? 'text-white' : 'text-slate-500'}>{s.num}</span>
                )}
              </motion.div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-0.5 w-10 rounded-full transition-colors ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
          >
            {hasDescription && !editing ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </div>
                    <h3 className="font-semibold text-foreground">Your business description</h3>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setEditing(true)}
                    className="h-9 rounded-lg border-slate-200 text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-3.5 w-3.5">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z" />
                    </svg>
                    Edit
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {existingDescription}
                  </p>
                </div>

                <Button
                  onClick={proceedToConnect}
                  className="h-11 w-full rounded-xl gradient-primary text-white font-medium shadow-glow transition-all hover:opacity-90 active:scale-[0.98]"
                >
                  Continue to WhatsApp
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 h-4 w-4">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {hasDescription ? 'Edit your business description' : 'Describe your business'}
                  </Label>
                  <Textarea
                    placeholder="Tell us everything - what your business does, services offered, business hours, industry, and your preferred communication tone..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="min-h-[180px] resize-none rounded-xl border-slate-200 text-sm leading-relaxed focus:border-emerald-500 focus:ring-emerald-500/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    The more detail you provide, the better your AI assistant will perform.
                  </p>
                </div>
                <div className="flex gap-2">
                  {hasDescription && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDescription(existingDescription)
                        setEditing(false)
                        setError('')
                      }}
                      className="h-11 flex-1 rounded-xl border-slate-200"
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    onClick={saveBusinessDetails}
                    disabled={saving || !description.trim()}
                    className="h-11 flex-1 rounded-xl gradient-primary text-white font-medium shadow-glow transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    {saving ? 'Saving...' : hasDescription ? 'Save changes' : 'Save & Continue'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
          >
            {connected ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </motion.div>
                <h3 className="mb-2 text-xl font-bold text-foreground">WhatsApp Connected!</h3>
                <p className="mb-6 text-sm text-muted-foreground">Your AI assistant is ready to handle conversations</p>
                <Button onClick={() => router.push('/dashboard')} className="h-11 rounded-xl gradient-primary px-8 text-white font-medium shadow-glow transition-all hover:opacity-90 active:scale-[0.98]">
                  Go to Dashboard
                </Button>
              </motion.div>
            ) : connectionMode === 'choose' ? (
              <div className="space-y-5 py-4 text-center">
                <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">Connect Your WhatsApp</h3>
                  <p className="mx-auto max-w-sm text-sm text-muted-foreground">Choose how you want to link your business number</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={startQrConnection}
                    className="group rounded-xl border-2 border-slate-200 p-4 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect width="5" height="5" x="3" y="3" rx="1" />
                        <rect width="5" height="5" x="16" y="3" rx="1" />
                        <rect width="5" height="5" x="3" y="16" rx="1" />
                        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                        <path d="M21 21v.01" />
                        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-foreground">Scan QR Code</p>
                    <p className="mt-1 text-xs text-muted-foreground">Scan with your phone camera</p>
                  </button>
                  <button
                    onClick={() => setConnectionMode('pairing')}
                    className="group rounded-xl border-2 border-slate-200 p-4 text-left transition-all hover:border-emerald-400 hover:bg-emerald-50/50"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 transition-colors group-hover:bg-blue-100">
                      <svg viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-foreground">Use Pairing Code</p>
                    <p className="mt-1 text-xs text-muted-foreground">Enter a code in WhatsApp</p>
                  </button>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-muted-foreground transition-colors hover:text-emerald-600"
                >
                  ← Back to business description
                </button>
              </div>
            ) : connectionMode === 'qr' ? (
              <div className="space-y-4 py-2 text-center">
                {qrUrl ? (
                  <>
                    <p className="text-sm font-medium text-foreground">Scan with WhatsApp</p>
                    <div className="inline-block rounded-2xl border-2 border-dashed border-emerald-200 bg-white p-4 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrUrl} alt="WhatsApp QR Code" className="h-52 w-52" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      Waiting for connection...
                    </div>
                    <button
                      onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setConnectionMode('pairing'); setQrUrl('') }}
                      className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      QR not working? Try pairing code
                    </button>
                  </>
                ) : (
                  <div className="py-4">
                    <svg className="mx-auto h-8 w-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="mt-3 text-sm text-muted-foreground">Loading QR code...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 py-2">
                {!pairingCode ? (
                  <>
                    <div className="text-center">
                      <h3 className="mb-1 font-semibold">Enter Your Phone Number</h3>
                      <p className="text-sm text-muted-foreground">We&apos;ll generate a pairing code for your WhatsApp</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone Number (with country code)</Label>
                      <Input
                        placeholder="923001234567"
                        value={pairingPhone}
                        onChange={e => setPairingPhone(e.target.value)}
                        className="h-11 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>
                    <Button
                      onClick={startPairingConnection}
                      disabled={loadingPairing || !pairingPhone.trim()}
                      className="h-11 w-full rounded-xl gradient-primary text-white font-medium shadow-glow transition-all hover:opacity-90 active:scale-[0.98]"
                    >
                      {loadingPairing ? (
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Getting code...
                        </div>
                      ) : 'Get Pairing Code'}
                    </Button>
                    <button
                      onClick={() => setConnectionMode('choose')}
                      className="w-full text-center text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      Try QR code instead
                    </button>
                  </>
                ) : (
                  <div className="space-y-4 text-center">
                    <h3 className="font-semibold">Your Pairing Code</h3>
                    <div className="inline-block rounded-2xl border-2 border-dashed border-emerald-200 bg-slate-50 px-6 py-4">
                      <p className="font-mono text-3xl font-bold tracking-[0.3em] text-foreground sm:text-4xl">{pairingCode}</p>
                    </div>
                    <div className="space-y-2 rounded-xl bg-blue-50 p-4 text-left">
                      <p className="text-sm font-medium text-blue-900">How to use this code:</p>
                      <ol className="list-inside list-decimal space-y-1 text-xs text-blue-700">
                        <li>Open WhatsApp on your phone</li>
                        <li>Go to Settings &gt; Linked Devices</li>
                        <li>Tap &quot;Link a Device&quot;</li>
                        <li>Tap &quot;Link with phone number instead&quot;</li>
                        <li>Enter the code above</li>
                      </ol>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      Waiting for connection...
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
