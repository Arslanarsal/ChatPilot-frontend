'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Contact, PaginatedResponse } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type BotFilter = 'all' | 'on' | 'off'
type ActiveWithin = 'all' | '24h' | '7d'

type Filters = {
  needs_review: boolean
  bot: BotFilter
  has_appointment: boolean
  active_within: ActiveWithin
}

const DEFAULT_FILTERS: Filters = {
  needs_review: false,
  bot: 'all',
  has_appointment: false,
  active_within: 'all',
}

export default function ContactsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [contacts, setContacts] = useState<PaginatedResponse<Contact> | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const companyId = user?.company_id

  const hasActiveFilters = useMemo(
    () =>
      filters.needs_review ||
      filters.has_appointment ||
      filters.bot !== 'all' ||
      filters.active_within !== 'all' ||
      search.trim().length > 0,
    [filters, search],
  )

  const fetchContacts = useCallback(async () => {
    if (!companyId) return
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: 20,
        search: search || undefined,
        needs_review: filters.needs_review ? 'true' : undefined,
        has_appointment: filters.has_appointment ? 'true' : undefined,
        bot_activated:
          filters.bot === 'on' ? 'true' : filters.bot === 'off' ? 'false' : undefined,
        active_within: filters.active_within !== 'all' ? filters.active_within : undefined,
      }
      const res = await api.get(`/companies/${companyId}/contacts`, { params })
      setContacts(res.data)
    } catch {}
  }, [companyId, page, search, filters])

  useEffect(() => { fetchContacts() }, [fetchContacts])
  useEffect(() => { setPage(1) }, [search, filters])

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
    } catch {}
    setTogglingId(null)
  }

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setSearch('')
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
          <p className="mt-1 text-muted-foreground">
            {contacts?.total ?? 0} {hasActiveFilters ? 'matching' : 'total'} contacts
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-11 rounded-xl border-slate-200 bg-white pl-11 focus:border-emerald-500 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterPill
            active={filters.needs_review}
            activeColor="amber"
            onClick={() => setFilters(f => ({ ...f, needs_review: !f.needs_review }))}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
            }
          >
            Needs review
          </FilterPill>

          <Segmented
            value={filters.bot}
            onChange={v => setFilters(f => ({ ...f, bot: v }))}
            options={[
              { value: 'all', label: 'All' },
              { value: 'on', label: 'Bot on' },
              { value: 'off', label: 'Bot off' },
            ]}
          />

          <FilterPill
            active={filters.has_appointment}
            activeColor="emerald"
            onClick={() => setFilters(f => ({ ...f, has_appointment: !f.has_appointment }))}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
          >
            Has booked
          </FilterPill>

          <select
            value={filters.active_within}
            onChange={e => setFilters(f => ({ ...f, active_within: e.target.value as ActiveWithin }))}
            className="h-9 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All time</option>
            <option value="24h">Active in 24h</option>
            <option value="7d">Active in 7 days</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 text-xs font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {contacts ? (
        <>
          <div className="space-y-2">
            {contacts.data.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => router.push(`/contacts/${contact.id}`)}
                className="group flex cursor-pointer items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 transition-all duration-200 hover:border-emerald-200/50 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white shadow-sm">
                  {(contact.name || contact.whatsapp_profile_name || '?')[0]?.toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <h4 className="truncate font-semibold text-foreground">{displayName(contact)}</h4>
                      {contact.needs_review && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Needs review
                        </span>
                      )}
                      {contact.crm_appointment_id && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Booked
                        </span>
                      )}
                    </div>
                    <span className="ml-2 shrink-0 text-xs text-muted-foreground">
                      {timeAgo(contact.last_message_received)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="max-w-[300px] truncate text-sm text-muted-foreground">{lastMsg(contact)}</p>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                      {contact.total_messages > 0 && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted-foreground">
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

                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-300 transition-colors group-hover:text-emerald-500">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </motion.div>
            ))}
            {contacts.data.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgb(148,163,184)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </div>
                <p className="font-medium text-muted-foreground">
                  {hasActiveFilters ? 'No contacts match these filters' : 'No contacts found'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasActiveFilters ? 'Try clearing filters or a different search.' : 'Contacts will appear here when customers message you.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {contacts.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg">
                Previous
              </Button>
              <span className="px-2 text-sm text-muted-foreground">
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
            <div key={i} className="h-20 animate-pulse rounded-xl border border-slate-200/50 bg-white/60" />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  activeColor,
  onClick,
  icon,
  children,
}: {
  active: boolean
  activeColor: 'amber' | 'emerald'
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const activeStyles = {
    amber: 'border-amber-300 bg-amber-50 text-amber-800 ring-1 ring-amber-200/60',
    emerald: 'border-emerald-300 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/60',
  }[activeColor]

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-all',
        active ? activeStyles : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white p-0.5">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'inline-flex h-8 items-center rounded-full px-3 text-sm font-medium transition-all',
            value === opt.value
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
