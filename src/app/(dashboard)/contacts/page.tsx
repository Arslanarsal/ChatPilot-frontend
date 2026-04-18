'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Contact, PaginatedResponse } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function ContactsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<PaginatedResponse<Contact> | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const companyId = user?.company_id

  const fetchContacts = useCallback(async () => {
    if (!companyId) return
    try {
      const res = await api.get(`/companies/${companyId}/contacts`, {
        params: { page, limit: 20, search: search || undefined },
      })
      setContacts(res.data)
    } catch { /* silent */ }
  }, [companyId, page, search])

  useEffect(() => { fetchContacts() }, [fetchContacts])
  useEffect(() => { setPage(1) }, [search])

  const toggleBot = async (contactId: number, currentValue: boolean) => {
    if (!companyId) return
    setTogglingId(contactId)
    try {
      await api.put(`/companies/${companyId}/contacts/${contactId}/bot-toggle`, {
        is_bot_activated: !currentValue,
      })
      setContacts(prev => prev ? {
        ...prev,
        data: prev.data.map(c => c.id === contactId ? { ...c, is_bot_activated: !currentValue } : c),
      } : prev)
    } catch { /* silent */ }
    setTogglingId(null)
  }

  const displayName = (c: Contact) => c.name || c.whatsapp_profile_name || `+${c.phone}`
  const lastMsg = (c: Contact) => {
    if (c.messages?.length) {
      const m = c.messages[0].message
      return m.length > 60 ? m.substring(0, 60) + '...' : m
    }
    return 'No messages yet'
  }
  const timeAgo = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contacts</h2>
          <p className="text-muted-foreground mt-1">{contacts?.total ?? 0} total contacts</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-11 h-11 rounded-xl bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
        />
      </div>

      {contacts ? (
        <>
          <div className="space-y-2">
            {contacts.data.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => router.push(`/contacts/${contact.id}`)}
                className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200/60 p-4 cursor-pointer hover:shadow-md hover:border-emerald-200/50 transition-all duration-200"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
                  {(contact.name || contact.whatsapp_profile_name || '?')[0]?.toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground truncate">{displayName(contact)}</h4>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {timeAgo(contact.last_message_received)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[300px]">{lastMsg(contact)}</p>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {contact.total_messages > 0 && (
                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                          {contact.total_messages} msgs
                        </span>
                      )}
                      <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <span className={`text-[10px] font-medium ${contact.is_bot_activated ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {contact.is_bot_activated ? 'Bot On' : 'Bot Off'}
                        </span>
                        <Switch
                          checked={!!contact.is_bot_activated}
                          onCheckedChange={() => toggleBot(contact.id, !!contact.is_bot_activated)}
                          disabled={togglingId === contact.id}
                          className={contact.is_bot_activated ? '!bg-emerald-500' : '!bg-slate-300'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0"><path d="m9 18 6-6-6-6"/></svg>
              </motion.div>
            ))}
            {contacts.data.length === 0 && (
              <div className="text-center py-16">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(148,163,184)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                </div>
                <p className="text-muted-foreground font-medium">No contacts found</p>
                <p className="text-sm text-muted-foreground mt-1">Contacts will appear here when customers message you</p>
              </div>
            )}
          </div>

          {contacts.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg">
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {page} of {contacts.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= contacts.totalPages} onClick={() => setPage(p => p + 1)} className="rounded-lg">
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white/60 rounded-xl border border-slate-200/50 animate-pulse" />
          ))}
        </div>
      )}
    </div>
  )
}
