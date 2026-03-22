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
  { num: 2, title: 'AI Configuration', desc: 'Generate your AI assistant' },
  { num: 3, title: 'Connect WhatsApp', desc: 'Link your WhatsApp number' },
]

export default function SetupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [description, setDescription] = useState('')
  const [promptGenerated, setPromptGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)

  // Step 3 - Connection
  const [connectionMode, setConnectionMode] = useState<'choose' | 'qr' | 'pairing'>('choose')
  const [qrUrl, setQrUrl] = useState('')
  const [connected, setConnected] = useState(false)
  const [pairingPhone, setPairingPhone] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [loadingPairing, setLoadingPairing] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval>>()
  const companyId = user?.company_id

  const saveBusinessDetails = async () => {
    if (!companyId || !description.trim()) return
    setSaving(true)
    await api.put(`/companies/${companyId}/business-details`, { description })
    setSaving(false)
    setStep(2)
  }

  const generatePrompt = async () => {
    if (!companyId) return
    setGenerating(true)
    try {
      await api.post(`/companies/${companyId}/generate-prompt`)
      setPromptGenerated(true)
    } catch { /* silent */ }
    finally { setGenerating(false) }
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
      } catch { /* keep polling */ }
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
    } catch { /* no session yet */ }

    try {
      await api.post(`/companies/${companyId}/create_session`)
    } catch {
      try {
        const statusRes = await api.get(`/companies/${companyId}/connection_status`)
        if (statusRes.data?.state === 'CONNECTED') {
          setConnected(true)
          return
        }
      } catch { /* fall through */ }
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const statusRes = await api.get(`/companies/${companyId}/connection_status`)
      if (statusRes.data?.state === 'CONNECTED') {
        setConnected(true)
        return
      }
    } catch { /* not connected yet */ }

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
      } catch { /* keep polling */ }
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

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-foreground">Setup Wizard</h2>
        <p className="text-muted-foreground mt-1 text-sm">Configure your AI assistant in 3 easy steps</p>
      </motion.div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-3 flex-1">
              <motion.div
                animate={{
                  scale: step === s.num ? 1.1 : 1,
                  backgroundColor: step >= s.num ? 'rgb(16,185,129)' : 'rgb(226,232,240)',
                }}
                className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              >
                {step > s.num ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                ) : (
                  <span className={step === s.num ? 'text-white' : 'text-slate-500'}>{s.num}</span>
                )}
              </motion.div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${step >= s.num ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-10 mx-2 rounded-full transition-colors ${step > s.num ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 - Business Description */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Describe your business</Label>
                <Textarea
                  placeholder="Tell us everything - what your business does, services offered, business hours, industry, and your preferred communication tone..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="min-h-[160px] rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none text-sm leading-relaxed"
                />
                <p className="text-xs text-muted-foreground">The more detail you provide, the better your AI assistant will perform.</p>
              </div>
              <Button
                onClick={saveBusinessDetails}
                disabled={saving || !description.trim()}
                className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 text-white font-medium shadow-glow transition-all active:scale-[0.98]"
              >
                {saving ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 - AI Configuration (simplified: no prompt display) */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6"
          >
            <div className="space-y-4">
              {!promptGenerated ? (
                <>
                  <div className="text-center py-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                    </div>
                    <h3 className="font-semibold mb-1">Generate AI Prompt</h3>
                    <p className="text-sm text-muted-foreground">Our AI will create a custom prompt based on your description</p>
                  </div>
                  <Button onClick={generatePrompt} disabled={generating} className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 text-white font-medium shadow-glow transition-all active:scale-[0.98]">
                    {generating ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Generating...
                      </div>
                    ) : 'Generate AI Prompt'}
                  </Button>
                </>
              ) : (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">AI Prompt Created!</h3>
                  <p className="text-sm text-muted-foreground mb-6">Your assistant is configured and ready to handle conversations</p>
                  <Button onClick={() => setStep(3)} className="h-11 px-8 rounded-xl gradient-primary hover:opacity-90 text-white font-medium shadow-glow transition-all active:scale-[0.98]">
                    Continue to WhatsApp
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 3 - WhatsApp Connection (QR + Pairing Code) */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6"
          >
            {connected ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                  className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">WhatsApp Connected!</h3>
                <p className="text-sm text-muted-foreground mb-6">Your AI assistant is ready to handle conversations</p>
                <Button onClick={() => router.push('/dashboard')} className="h-11 px-8 rounded-xl gradient-primary hover:opacity-90 text-white font-medium shadow-glow transition-all active:scale-[0.98]">
                  Go to Dashboard
                </Button>
              </motion.div>

            ) : connectionMode === 'choose' ? (
              /* Choose connection method */
              <div className="text-center py-4 space-y-5">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Your WhatsApp</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Choose how you want to link your business number</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={startQrConnection}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                    </div>
                    <p className="font-semibold text-sm text-foreground">Scan QR Code</p>
                    <p className="text-xs text-muted-foreground mt-1">Scan with your phone camera</p>
                  </button>
                  <button
                    onClick={() => setConnectionMode('pairing')}
                    className="p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group"
                  >
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <p className="font-semibold text-sm text-foreground">Use Pairing Code</p>
                    <p className="text-xs text-muted-foreground mt-1">Enter a code in WhatsApp</p>
                  </button>
                </div>
              </div>

            ) : connectionMode === 'qr' ? (
              /* QR Code mode */
              <div className="text-center py-2 space-y-4">
                {qrUrl ? (
                  <>
                    <p className="text-sm font-medium text-foreground">Scan with WhatsApp</p>
                    <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-200 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrUrl} alt="WhatsApp QR Code" className="h-52 w-52" />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                          />
                        ))}
                      </div>
                      Waiting for connection...
                    </div>
                    <button
                      onClick={() => { if (pollRef.current) clearInterval(pollRef.current); setConnectionMode('pairing'); setQrUrl('') }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                    >
                      QR not working? Try pairing code
                    </button>
                  </>
                ) : (
                  <div className="py-4">
                    <svg className="animate-spin h-8 w-8 text-emerald-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    <p className="text-sm text-muted-foreground mt-3">Loading QR code...</p>
                  </div>
                )}
              </div>

            ) : (
              /* Pairing Code mode */
              <div className="py-2 space-y-4">
                {!pairingCode ? (
                  <>
                    <div className="text-center">
                      <h3 className="font-semibold mb-1">Enter Your Phone Number</h3>
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
                      className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 text-white font-medium shadow-glow transition-all active:scale-[0.98]"
                    >
                      {loadingPairing ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Getting code...
                        </div>
                      ) : 'Get Pairing Code'}
                    </Button>
                    <button
                      onClick={() => setConnectionMode('choose')}
                      className="w-full text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-center"
                    >
                      Try QR code instead
                    </button>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold">Your Pairing Code</h3>
                    <div className="inline-block px-6 py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-200">
                      <p className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.3em] text-foreground">{pairingCode}</p>
                    </div>
                    <div className="text-left bg-blue-50 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-medium text-blue-900">How to use this code:</p>
                      <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
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
                          <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-emerald-500"
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
