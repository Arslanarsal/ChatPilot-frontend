'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Contact, DashboardStats, PaginatedResponse } from '@/lib/types'
import { Switch } from '@/components/ui/switch'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentContacts, setRecentContacts] = useState<Contact[]>([])
  const [toggling, setToggling] = useState(false)
  const companyId = user?.company_id

  const fetchStats = useCallback(async () => {
    if (!companyId) return
    try {
      const res = await api.get(`/companies/${companyId}/dashboard`)
      setStats(res.data)
    } catch {}
  }, [companyId])

  const fetchRecent = useCallback(async () => {
    if (!companyId) return
    try {
      const res = await api.get(`/companies/${companyId}/contacts`, {
        params: { page: 1, limit: 5 },
      })
      setRecentContacts((res.data as PaginatedResponse<Contact>).data)
    } catch {}
  }, [companyId])

  useEffect(() => {
    fetchStats()
    fetchRecent()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats, fetchRecent])

  const toggleBot = async () => {
    if (!companyId || !stats) return
    setToggling(true)
    try {
      await api.put(`/companies/${companyId}/bot-settings`, {
        is_bot_activated: !stats.is_bot_activated,
      })
      setStats(prev => prev ? { ...prev, is_bot_activated: !prev.is_bot_activated } : prev)
    } catch {}
    finally { setToggling(false) }
  }

  const displayName = (c: Contact) => c.name || c.whatsapp_profile_name || `+${c.phone}`
  const timeAgo = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-24 animate-pulse rounded-2xl border border-slate-200/50 bg-white/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-slate-200/50 bg-white/60" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 animate-pulse rounded-2xl border border-slate-200/50 bg-white/60" />
          <div className="h-64 animate-pulse rounded-2xl border border-slate-200/50 bg-white/60 lg:col-span-2" />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Contacts',
      value: stats.contacts_count,
      href: '/contacts',
      bg: 'bg-blue-50',
      iconColor: 'rgb(59,130,246)',
      icon: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>,
      icon2: <><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    },
    {
      label: 'Total Messages',
      value: stats.messages_count,
      href: '/chats',
      bg: 'bg-violet-50',
      iconColor: 'rgb(139,92,246)',
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    },
    {
      label: 'Bot Replies',
      value: stats.bot_messages_count,
      href: '/chats',
      bg: 'bg-amber-50',
      iconColor: 'rgb(245,158,11)',
      icon: <><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></>,
    },
  ]

  const botRatio = stats.messages_count > 0
    ? Math.round((stats.bot_messages_count / stats.messages_count) * 100)
    : 0

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back{user?.company_name ? `, ${user.company_name}` : ''}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s your business overview.</p>
      </motion.div>

      {!stats.whatsapp_connected && (
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-6">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-200/60 blur-2xl" />
            <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                    <path d="m4.93 19 7.07-12.3L19.07 19z" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900">Connect your WhatsApp to go live</h3>
                  <p className="mt-1 text-sm text-amber-800/80">
                    Your AI is ready. Pair your phone from Settings → Linked Devices to start replying to customers.
                  </p>
                </div>
              </div>
              <Link
                href="/setup"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-amber-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Connect now
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <motion.div key={card.label} variants={item}>
            <Link href={card.href}>
              <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${card.bg} opacity-60 transition-opacity group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke={card.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">{card.icon}{card.icon2}</svg>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{card.value.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        <motion.div variants={item}>
          <Link href="/settings">
            <div className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stats.whatsapp_connected ? 'bg-emerald-50' : 'bg-red-50'} opacity-60 transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stats.whatsapp_connected ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={stats.whatsapp_connected ? 'rgb(16,185,129)' : 'rgb(239,68,68)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M3 12a9 9 0 1 0 3.2-6.9L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${stats.whatsapp_connected ? 'animate-pulse bg-emerald-500' : 'bg-red-400'}`} />
                  <span className={`text-sm font-semibold ${stats.whatsapp_connected ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stats.whatsapp_connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div variants={item}>
          <div className="h-full rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <svg viewBox="0 0 24 24" fill="none" stroke="rgb(245,158,11)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Bot</h3>
                <p className="text-xs text-muted-foreground">Auto-reply to customers</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <div>
                <span className={`text-sm font-semibold ${stats.is_bot_activated ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {stats.is_bot_activated ? 'Active' : 'Paused'}
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stats.is_bot_activated ? 'Responding to messages' : 'Bot is paused'}
                </p>
              </div>
              <Switch checked={stats.is_bot_activated} onCheckedChange={toggleBot} disabled={toggling} />
            </div>
            <div className="mt-4 rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bot reply share</span>
                <span className="text-xs font-semibold text-emerald-700">{botRatio}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${botRatio}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {stats.bot_messages_count.toLocaleString()} of {stats.messages_count.toLocaleString()} messages handled automatically
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-semibold text-foreground">Recent conversations</h3>
              <Link href="/chats" className="text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700">
                View all
              </Link>
            </div>
            {recentContacts.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentContacts.map((contact) => (
                  <Link key={contact.id} href="/chats">
                    <div className="flex cursor-pointer items-center gap-3 px-6 py-3 transition-colors hover:bg-slate-50/60">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-xs font-bold text-white">
                        {(contact.name || contact.whatsapp_profile_name || '?')[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-sm font-medium text-foreground">{displayName(contact)}</h4>
                          <span className="ml-2 shrink-0 text-[11px] text-muted-foreground">{timeAgo(contact.last_message_received)}</span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {contact.messages?.length ? contact.messages[0].message : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-slate-400">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">No conversations yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Share your WhatsApp number — customers will show up here the moment they message you.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <h3 className="mb-3 font-semibold text-foreground">Quick actions</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: '/chats', title: 'View chats', desc: 'See all customer conversations', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 hover:bg-blue-100/80' },
            { href: '/setup', title: 'Setup wizard', desc: 'Configure AI and WhatsApp', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100/80' },
            { href: '/settings', title: 'Settings', desc: 'Business details and preferences', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 hover:bg-violet-100/80' },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`${action.bg} cursor-pointer rounded-xl border border-slate-200/40 p-4 transition-all duration-200`}
              >
                <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} text-white shadow-sm`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{action.title}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
