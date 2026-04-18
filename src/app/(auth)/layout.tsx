'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  'AI replies in under a second',
  'Books appointments via cal.com',
  'Speaks Urdu + English fluently',
  'Per-contact bot override',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-[55%]">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-emerald-400/40 blur-[120px] animate-blob" />
        <div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-teal-300/30 blur-[120px] animate-blob animation-delay-2000" />

        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 flex w-full flex-col justify-between px-14 py-14"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                <path d="M3 12a9 9 0 1 0 3.2-6.9L3 8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-xl font-semibold tracking-tight">ChatPilot</span>
          </Link>

          <div>
            <h1 className="text-balance text-5xl font-bold leading-tight text-white">
              Your WhatsApp,<br />
              answering for itself.
            </h1>
            <p className="mt-6 max-w-md text-lg text-emerald-50/90">
              Pair your number. Describe your business. Watch the AI handle every customer
              message — day or night.
            </p>

            <ul className="mt-10 space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 text-emerald-50"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3 w-3">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium">{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <figure className="max-w-md rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
            <blockquote className="text-sm leading-relaxed text-emerald-50">
              &ldquo;We went from missing half our after-hours leads to answering every single one.
              Bookings are up 38% this month.&rdquo;
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-300 to-teal-400" />
              <div>
                <div className="text-sm font-semibold text-white">Dr. Hina Raza</div>
                <div className="text-xs text-emerald-100/70">Bright Smile Dental, Lahore</div>
              </div>
            </figcaption>
          </figure>
        </motion.div>
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-1/2 xl:w-[45%]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
