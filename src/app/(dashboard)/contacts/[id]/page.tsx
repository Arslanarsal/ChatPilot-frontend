'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'
import api from '@/lib/api'
import { Contact, Message } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageComposer } from '@/components/chat/message-composer'
import { isSameThread } from '@/lib/utils'

export default function ChatViewPage() {
  const { user } = useAuth()
  const params = useParams()
  const contactId = params.id as string
  const [contact, setContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [atBottom, setAtBottom] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevCount = useRef(0)
  const companyId = user?.company_id

  const fetchMessages = useCallback(async () => {
    if (!companyId || !contactId) return
    try {
      const res = await api.get(`/companies/${companyId}/contacts/${contactId}/messages`)
      setContact(res.data.contact)
      const next: Message[] = res.data.messages
      // Keep the previous array when nothing changed, so the 8s poll does not
      // re-render (and re-animate) the whole conversation.
      setMessages(prev => (isSameThread(prev, next) ? prev : next))
    } catch { /* silent */ }
  }, [companyId, contactId])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  // Follow new messages down only when the reader is already at the bottom.
  useEffect(() => {
    const grew = messages.length > prevCount.current
    prevCount.current = messages.length
    if (grew && atBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, atBottom])

  useEffect(() => {
    const interval = setInterval(fetchMessages, 8000)
    return () => clearInterval(interval)
  }, [fetchMessages])

  const displayName = contact?.name || contact?.whatsapp_profile_name || `+${contact?.phone}`
  const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const formatDate = (d: string) => new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })

  const grouped: { date: string; msgs: Message[] }[] = []
  messages.forEach(msg => {
    const date = new Date(msg.sent_at).toDateString()
    const last = grouped[grouped.length - 1]
    if (last?.date === date) last.msgs.push(msg)
    else grouped.push({ date, msgs: [msg] })
  })

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col -m-6 lg:-m-8">
      <div className="flex items-center gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl px-6 py-3">
        <Link href="/contacts">
          <Button variant="ghost" size="sm" className="rounded-lg text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          </Button>
        </Link>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-sm">
          {displayName[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{displayName}</h3>
          <p className="text-xs text-muted-foreground">{contact?.phone ? `+${contact.phone}` : ''}</p>
        </div>
        <Badge variant={contact?.is_bot_activated ? 'default' : 'secondary'} className={`${contact?.is_bot_activated ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : ''}`}>
          AI {contact?.is_bot_activated ? 'On' : 'Off'}
        </Badge>
      </div>

      <div
        className="flex-1 overflow-auto bg-[#f0f2f5] px-4 sm:px-8 py-4"
        onScroll={e => {
          const el = e.currentTarget
          setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80)
        }}
      >
        <div className="max-w-3xl mx-auto space-y-1">
          {grouped.map((group, gi) => (
            <div key={gi}>
              <div className="flex justify-center my-4">
                <span className="text-xs bg-white/90 text-muted-foreground px-3 py-1 rounded-full shadow-sm border border-slate-200/50">
                  {formatDate(group.msgs[0].sent_at)}
                </span>
              </div>
              {group.msgs.map((msg, mi) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(mi * 0.02, 0.3) }}
                  className={`flex mb-1.5 ${msg.author_type === 'human' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`relative max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                      msg.author_type === 'human'
                        ? 'bg-white text-foreground rounded-tl-md'
                        : msg.author_type === 'user_whatsapp'
                          ? 'bg-blue-500 text-white rounded-tr-md'
                          : 'bg-emerald-500 text-white rounded-tr-md'
                    }`}
                  >
                    {msg.author_type !== 'human' && (
                      <p className={`text-[10px] font-medium mb-0.5 ${msg.author_type === 'user_whatsapp' ? 'text-blue-200' : 'text-emerald-200'}`}>
                        {msg.author_type === 'user_whatsapp' ? 'You' : 'AI Bot'}
                      </p>
                    )}
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    {msg.image_url && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={msg.image_url} alt="attachment" className="mt-2 max-w-full rounded-lg" />
                    )}
                    <p className={`text-[10px] mt-1 text-right ${msg.author_type === 'human' ? 'text-slate-400' : msg.author_type === 'user_whatsapp' ? 'text-blue-200' : 'text-emerald-200'}`}>
                      {msg.sent_at ? formatTime(msg.sent_at) : ''}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="h-14 w-14 rounded-2xl bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(148,163,184)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-sm text-muted-foreground">No messages yet</p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <MessageComposer
        companyId={companyId}
        contactId={contactId}
        onSent={fetchMessages}
      />
    </div>
  )
}
