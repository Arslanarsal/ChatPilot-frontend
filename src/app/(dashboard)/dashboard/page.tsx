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
    } catch { /* silent */ }
  }, [companyId])

  const fetchRecent = useCallback(async () => {
    if (!companyId) return
    try {
      const res = await api.get(`/companies/${companyId}/contacts`, {
        params: { page: 1, limit: 5 },
      })
      setRecentContacts((res.data as PaginatedResponse<Contact>).data)
    } catch { /* silent */ }
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
    } catch { /* silent */ }
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
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white/60 rounded-2xl border border-slate-200/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Contacts',
      value: stats.contacts_count,
      href: '/contacts',
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      iconColor: 'rgb(59,130,246)',
      icon: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>,
      icon2: <><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    },
    {
      label: 'Total Messages',
      value: stats.messages_count,
      href: '/chats',
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      iconColor: 'rgb(139,92,246)',
      icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
    },
    {
      label: 'Bot Replies',
      value: stats.bot_messages_count,
      href: '/chats',
      gradient: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
      iconColor: 'rgb(245,158,11)',
      icon: <><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></>,
    },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item}>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back{user?.company_name ? `, ${user.company_name}` : ''}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">Here&apos;s your business overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <motion.div key={card.label} variants={item}>
            <Link href={card.href}>
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${card.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="relative">
                  <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={card.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{card.icon}{card.icon2}</svg>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.value.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* WhatsApp Status Card */}
        <motion.div variants={item}>
          <Link href="/settings">
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${stats.whatsapp_connected ? 'bg-emerald-50' : 'bg-red-50'} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className={`h-10 w-10 rounded-xl ${stats.whatsapp_connected ? 'bg-emerald-50' : 'bg-red-50'} flex items-center justify-center mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stats.whatsapp_connected ? 'rgb(16,185,129)' : 'rgb(239,68,68)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">WhatsApp</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className={`h-2 w-2 rounded-full ${stats.whatsapp_connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                  <span className={`text-sm font-semibold ${stats.whatsapp_connected ? 'text-emerald-600' : 'text-red-500'}`}>
                    {stats.whatsapp_connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Bot Toggle + Recent Contacts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bot Card */}
        <motion.div variants={item}>
          <div className="rounded-2xl bg-white border border-slate-200/60 p-6 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(245,158,11)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI Bot</h3>
                <p className="text-xs text-muted-foreground">Auto-reply to customers</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div>
                <span className={`text-sm font-semibold ${stats.is_bot_activated ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {stats.is_bot_activated ? 'Active' : 'Inactive'}
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stats.is_bot_activated ? 'Responding to messages' : 'Bot is paused'}
                </p>
              </div>
              <Switch
                checked={stats.is_bot_activated}
                onCheckedChange={toggleBot}
                disabled={toggling}
              />
            </div>
          </div>
        </motion.div>

        {/* Recent Contacts */}
        <motion.div variants={item} className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-slate-200/60 shadow-sm h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-foreground">Recent Conversations</h3>
              <Link href="/chats" className="text-xs text-emerald-600 font-medium hover:text-emerald-700 transition-colors">
                View all
              </Link>
            </div>
            {recentContacts.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {recentContacts.map((contact) => (
                  <Link key={contact.id} href="/chats">
                    <div className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50/60 transition-colors cursor-pointer">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {(contact.name || contact.whatsapp_profile_name || '?')[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-foreground truncate">{displayName(contact)}</h4>
                          <span className="text-[11px] text-muted-foreground ml-2 shrink-0">{timeAgo(contact.last_message_received)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {contact.messages?.length ? contact.messages[0].message : 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6">
                <p className="text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Customers will appear here when they message you</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { href: '/chats', title: 'View Chats', desc: 'See all customer conversations', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 hover:bg-blue-100/80' },
            { href: '/setup', title: 'Setup Wizard', desc: 'Configure AI and WhatsApp', color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100/80' },
            { href: '/settings', title: 'Settings', desc: 'Business details and preferences', color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50 hover:bg-violet-100/80' },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                className={`${action.bg} rounded-xl border border-slate-200/40 p-4 transition-all duration-200 cursor-pointer`}
              >
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-2 shadow-sm`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">{action.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
