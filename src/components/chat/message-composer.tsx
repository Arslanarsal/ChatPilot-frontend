'use client'

import { useState } from 'react'
import api from '@/lib/api'

interface MessageComposerProps {
  companyId?: number
  contactId?: number | string
  /** Called after a message is sent so the parent can refresh the thread. */
  onSent?: () => void
}

export function MessageComposer({ companyId, contactId, onSent }: MessageComposerProps) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const disabled = !companyId || !contactId || sending

  const send = async () => {
    const message = text.trim()
    if (!message || disabled) return
    setSending(true)
    setError('')
    try {
      await api.post(`/companies/${companyId}/contacts/${contactId}/send`, { message })
      setText('')
      onSent?.()
    } catch {
      setError('Could not send. Check the WhatsApp connection and try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border-t border-slate-200/60 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            // Enter sends, Shift+Enter makes a new line.
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          rows={1}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] leading-relaxed outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 max-h-32"
        />
        <button
          type="button"
          onClick={send}
          disabled={disabled || !text.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </div>
      <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
        {error || 'Sending a message turns the AI off for this contact.'}
      </p>
    </div>
  )
}
