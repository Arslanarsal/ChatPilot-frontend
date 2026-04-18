'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { scorePassword, PASSWORD_RULES } from '@/lib/password'
import { cn } from '@/lib/utils'

export function PasswordStrength({ value, className }: { value: string; className?: string }) {
  if (!value) return null

  const { score, label, checks } = scorePassword(value)

  const segments = [
    score >= 1 ? (score === 1 ? 'bg-red-500' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-lime-500' : 'bg-emerald-500') : 'bg-slate-200',
    score >= 2 ? (score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-lime-500' : 'bg-emerald-500') : 'bg-slate-200',
    score >= 3 ? (score === 3 ? 'bg-lime-500' : 'bg-emerald-500') : 'bg-slate-200',
    score >= 4 ? 'bg-emerald-500' : 'bg-slate-200',
  ]

  const labelColor =
    score <= 1 ? 'text-red-600' :
    score === 2 ? 'text-amber-600' :
    score === 3 ? 'text-lime-600' :
    'text-emerald-600'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.2 }}
        className={cn('overflow-hidden', className)}
      >
        <div className="mt-2 space-y-3">
          <div className="flex items-center gap-1.5">
            {segments.map((s, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className={cn('h-1.5 flex-1 origin-left rounded-full transition-colors', s)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Password strength:</span>
            <span className={cn('font-semibold', labelColor)}>{label}</span>
          </div>

          <ul className="space-y-1">
            {PASSWORD_RULES.map((rule) => {
              const passed = checks[rule.key as keyof typeof checks]
              return (
                <li key={rule.key} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full transition-colors',
                      passed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400',
                    )}
                  >
                    {passed ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2.5 w-2.5">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-slate-400" />
                    )}
                  </span>
                  <span className={passed ? 'text-slate-700' : 'text-slate-500'}>{rule.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
