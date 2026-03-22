'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function SettingsPage() {
  const { user } = useAuth()
  const companyId = user?.company_id
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [connectMode, setConnectMode] = useState<'choose' | 'qr' | 'pairing'>('choose')
  const [qrUrl, setQrUrl] = useState('')
  const [pairingPhone, setPairingPhone] = useState('')
  const [pairingCode, setPairingCode] = useState('')
  const [loadingPairing, setLoadingPairing] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (user?.company?.business_details?.description) {
      setDescription(user.company.business_details.description)
    }
  }, [user])

  useEffect(() => {
    if (!companyId) return
    api.get(`/companies/${companyId}/connection_status`)
      .then(res => setConnectionStatus(res.data?.state === 'CONNECTED' ? 'Connected' : 'Disconnected'))
      .catch(() => setConnectionStatus('Disconnected'))
  }, [companyId])

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  const saveDetails = async () => {
    if (!companyId) return
    setSaving(true)
    try {
      await api.put(`/companies/${companyId}/business-details`, { description })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* silent */ }
    finally { setSaving(false) }
  }

  const disconnect = async () => {
    if (!companyId) return
    setDisconnecting(true)
    try {
      await api.delete(`/companies/${companyId}/remove-session`)
      setConnectionStatus('Disconnected')
    } catch { /* silent */ }
    finally { setDisconnecting(false) }
  }

  const openConnectDialog = () => {
    setConnectMode('choose')
    setQrUrl('')
    setPairingCode('')
    setPairingPhone('')
    setShowConnectDialog(true)
  }

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/companies/${companyId}/connection_status`)
        if (res.data?.state === 'CONNECTED') {
          setConnectionStatus('Connected')
          setShowConnectDialog(false)
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch { /* keep polling */ }
    }, 5000)
  }

  const startQrConnection = async () => {
    if (!companyId) return
    setConnectMode('qr')
    setConnectionStatus('Connecting...')

    try {
      const statusRes = await api.get(`/companies/${companyId}/connection_status`)
      if (statusRes.data?.state === 'CONNECTED') {
        setConnectionStatus('Connected')
        setShowConnectDialog(false)
        return
      }
    } catch { /* continue */ }

    try {
      await api.post(`/companies/${companyId}/create_session`)
    } catch {
      try {
        const statusRes = await api.get(`/companies/${companyId}/connection_status`)
        if (statusRes.data?.state === 'CONNECTED') {
          setConnectionStatus('Connected')
          setShowConnectDialog(false)
          return
        }
      } catch { /* fall through */ }
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

    try {
      const statusRes = await api.get(`/companies/${companyId}/connection_status`)
      if (statusRes.data?.state === 'CONNECTED') {
        setConnectionStatus('Connected')
        setShowConnectDialog(false)
        return
      }
    } catch { /* not connected yet */ }

    setQrUrl(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/get_qr?t=${Date.now()}`)
    setConnectionStatus('Disconnected')

    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/companies/${companyId}/connection_status`)
        if (res.data?.state === 'CONNECTED') {
          setConnectionStatus('Connected')
          setShowConnectDialog(false)
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
    setConnectionStatus('Connecting...')

    try {
      await api.post(`/companies/${companyId}/create_session`, {
        usePairingCode: true,
        phoneNumber: pairingPhone,
      })
      await new Promise(resolve => setTimeout(resolve, 2500))
      const res = await api.get(`/companies/${companyId}/pairing-code`)
      setPairingCode(res.data?.pairingCode || res.data?.data?.pairingCode || '')
      setConnectionStatus('Disconnected')
      startPolling()
    } catch {
      setPairingCode('')
      setConnectionStatus('Disconnected')
    } finally {
      setLoadingPairing(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1 text-sm">Manage your business and WhatsApp</p>
      </motion.div>

      {/* Business Description */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/></svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Business Description</h3>
            <p className="text-xs text-muted-foreground">Used by your AI assistant to understand your business</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Describe your business</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell us everything about your business - what you do, your services, hours, tone, industry..."
              className="min-h-[140px] rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">Include your services, hours, industry, and preferred communication tone.</p>
          </div>
          <Button
            onClick={saveDetails}
            disabled={saving || !description.trim()}
            className={`w-full h-11 rounded-xl transition-all ${saved ? 'bg-emerald-500 hover:bg-emerald-500' : 'gradient-primary hover:opacity-90'} text-white shadow-sm font-medium`}
          >
            {saving ? 'Saving...' : saved ? (
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                Saved!
              </span>
            ) : 'Save Description'}
          </Button>
        </div>
      </motion.div>

      {/* WhatsApp Connection */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-green-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">WhatsApp Connection</h3>
            <p className="text-xs text-muted-foreground">Manage your WhatsApp integration</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${connectionStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : connectionStatus === 'Connecting...' ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground text-sm">{connectionStatus || 'Checking...'}</span>
                  {connectionStatus === 'Connected' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">Active</span>
                  )}
                  {connectionStatus === 'Disconnected' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Offline</span>
                  )}
                </div>
                {connectionStatus === 'Connected' && (
                  <p className="text-xs text-muted-foreground mt-0.5">Your WhatsApp is linked and active</p>
                )}
                {connectionStatus === 'Disconnected' && (
                  <p className="text-xs text-muted-foreground mt-0.5">Connect via QR code or pairing code</p>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-3">
            {connectionStatus === 'Connected' ? (
              <Button
                onClick={disconnect}
                disabled={disconnecting}
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-9 text-sm px-5"
              >
                {disconnecting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Disconnecting...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" x2="12" y1="2" y2="12"/></svg>
                    Disconnect
                  </span>
                )}
              </Button>
            ) : connectionStatus === 'Connecting...' ? (
              <Button disabled className="rounded-xl gradient-primary text-white shadow-sm px-5 h-9 text-sm opacity-80">
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Connecting...
                </span>
              </Button>
            ) : connectionStatus === 'Disconnected' ? (
              <>
                <Button
                  onClick={() => { openConnectDialog(); setTimeout(() => startQrConnection(), 100) }}
                  className="rounded-xl gradient-primary hover:opacity-90 text-white shadow-sm px-5 h-9 text-sm"
                >
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                    QR Code
                  </span>
                </Button>
                <Button
                  onClick={() => { openConnectDialog(); setConnectMode('pairing') }}
                  variant="outline"
                  className="rounded-xl border-slate-200 hover:bg-slate-50 h-9 text-sm px-5"
                >
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    Pairing Code
                  </span>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Connect Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={(open) => {
        setShowConnectDialog(open)
        if (!open && pollRef.current) clearInterval(pollRef.current)
      }}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              {connectMode === 'choose' ? 'Connect WhatsApp' : connectMode === 'qr' ? 'Scan QR Code' : 'Pairing Code'}
            </DialogTitle>
          </DialogHeader>

          {/* Choose mode */}
          {connectMode === 'choose' && (
            <div className="space-y-3 py-4">
              <p className="text-sm text-muted-foreground text-center mb-4">Choose how to connect your WhatsApp</p>
              <button
                onClick={() => startQrConnection()}
                className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Scan QR Code</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Open WhatsApp &gt; Linked Devices &gt; Scan QR</p>
                </div>
              </button>
              <button
                onClick={() => setConnectMode('pairing')}
                className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-left flex items-center gap-4"
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Use Pairing Code</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Enter a code in WhatsApp instead of scanning</p>
                </div>
              </button>
            </div>
          )}

          {/* QR mode */}
          {connectMode === 'qr' && (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">Open WhatsApp on your phone and scan this QR code to connect</p>
              {qrUrl ? (
                <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-200 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="WhatsApp QR Code" className="h-56 w-56" />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                </div>
              )}
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
                onClick={() => { setConnectMode('pairing'); setQrUrl(''); if (pollRef.current) clearInterval(pollRef.current) }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                QR not working? Try pairing code
              </button>
            </div>
          )}

          {/* Pairing mode */}
          {connectMode === 'pairing' && (
            <div className="space-y-4 py-4">
              {!pairingCode ? (
                <>
                  <p className="text-sm text-muted-foreground text-center">Enter your WhatsApp phone number to get a pairing code</p>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <Input
                        placeholder="923001234567"
                        value={pairingPhone}
                        onChange={e => setPairingPhone(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={startPairingConnection}
                    disabled={loadingPairing || !pairingPhone.trim()}
                    className="w-full h-11 rounded-xl gradient-primary hover:opacity-90 text-white shadow-sm font-medium"
                  >
                    {loadingPairing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Getting Code...
                      </span>
                    ) : 'Get Pairing Code'}
                  </Button>
                  <button
                    onClick={() => setConnectMode('qr')}
                    className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors text-center"
                  >
                    Use QR code instead
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Enter this code in WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Go to WhatsApp &gt; Linked Devices &gt; Link a Device &gt; Link with phone number instead</p>
                  <div className="inline-block px-8 py-4 bg-slate-50 rounded-2xl border-2 border-dashed border-emerald-200">
                    <span className="text-3xl font-mono font-bold tracking-[0.3em] text-foreground">{pairingCode}</span>
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
        </DialogContent>
      </Dialog>
    </div>
  )
}
