'use client'

import * as React from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'
import { generatePassword } from '@/lib/password'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  suggest?: boolean
  onSuggest?: (generated: string) => void
  containerClassName?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, Props>(
  ({ className, containerClassName, suggest = false, onSuggest, onChange, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    const handleSuggest = async () => {
      const pw = generatePassword(14)
      try {
        await navigator.clipboard.writeText(pw)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {}

      if (onSuggest) {
        onSuggest(pw)
      } else if (onChange) {
        onChange({ target: { value: pw } } as React.ChangeEvent<HTMLInputElement>)
      }
      setVisible(true)
    }

    const suggestOffset = suggest ? 'pr-24' : 'pr-11'

    return (
      <div className={cn('relative', containerClassName)}>
        <Input
          ref={ref}
          type={visible ? 'text' : 'password'}
          className={cn(suggestOffset, className)}
          onChange={onChange}
          {...props}
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {suggest && (
            <button
              type="button"
              onClick={handleSuggest}
              className="inline-flex h-8 items-center rounded-md px-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              aria-label="Suggest strong password"
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-1 h-3.5 w-3.5">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>Suggest</>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => setVisible(v => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            {visible ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>
    )
  }
)
PasswordInput.displayName = 'PasswordInput'
