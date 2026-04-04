'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/auth-context'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gradient-bg">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="h-2 w-2 rounded-full bg-emerald-500"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.5 }} />
          ))}
        </motion.div>
      </div>
    )
  }

  if (user) return null

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      ),
      title: 'AI-Powered Replies',
      desc: 'Your AI assistant understands context, answers questions, and books appointments automatically.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      ),
      title: 'Per-Contact Control',
      desc: 'Toggle the AI bot on or off for each contact individually. Stay in control of every conversation.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      ),
      title: 'Real WhatsApp Integration',
      desc: 'Connect your actual WhatsApp number. Customers message you like normal — the AI handles the rest.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
      ),
      title: 'Live Dashboard',
      desc: 'See every conversation, track message stats, and monitor your WhatsApp connection in real time.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      ),
      title: 'Secure & Private',
      desc: 'Your data stays yours. End-to-end encryption on WhatsApp, secure auth, and no message storage by third parties.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      ),
      title: '24/7 Availability',
      desc: 'Never miss a customer again. Your AI bot responds instantly, day or night, even when you\'re offline.',
    },
  ]

  const steps = [
    { num: '01', title: 'Sign Up', desc: 'Create your account in seconds with just your phone number.' },
    { num: '02', title: 'Describe Your Business', desc: 'Tell the AI what your business does — it generates a custom prompt.' },
    { num: '03', title: 'Connect WhatsApp', desc: 'Scan a QR code or use a pairing code to link your number.' },
    { num: '04', title: 'Go Live', desc: 'Your AI assistant starts replying to customers automatically.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-xl font-bold text-foreground">ChatPilot</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-emerald-600 transition-colors px-4 py-2">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-medium text-white gradient-primary px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm">
              Sign Up Free
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden gradient-bg gradient-mesh">
        {/* Floating decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-float-delay" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              AI-Powered WhatsApp Automation
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Your business on{' '}
              <span className="text-gradient">autopilot</span>
              <br />while you sleep
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              ChatPilot connects an AI assistant to your WhatsApp. It answers customers, books appointments, and keeps your business running 24/7.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto gradient-primary text-white font-semibold px-8 py-3.5 rounded-xl text-base shadow-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Get Started Free
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto text-foreground font-semibold px-8 py-3.5 rounded-xl text-base border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="mt-16 sm:mt-20 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl shadow-emerald-500/10 bg-white">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1.5 text-xs text-muted-foreground border border-slate-200/60 max-w-xs mx-auto">
                    chatpilot.app/dashboard
                  </div>
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-6 w-48 bg-slate-100 rounded-lg" />
                    <div className="h-4 w-32 bg-slate-50 rounded mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Contacts', value: '1,247', color: 'bg-blue-50 text-blue-600' },
                    { label: 'Messages Today', value: '3,891', color: 'bg-violet-50 text-violet-600' },
                    { label: 'Bot Replies', value: '2,156', color: 'bg-amber-50 text-amber-600' },
                    { label: 'WhatsApp', value: 'Connected', color: 'bg-emerald-50 text-emerald-600' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-slate-200/60 p-4">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{s.label}</p>
                      <p className={`text-lg font-bold mt-1 ${s.color.split(' ')[1]}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-slate-200/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">AI Bot</span>
                      <div className="w-10 h-5 rounded-full bg-emerald-500 relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-medium">Active — Responding to messages</p>
                  </div>
                  <div className="lg:col-span-2 rounded-xl border border-slate-200/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">Recent Conversations</span>
                      <span className="text-xs text-emerald-600">View all</span>
                    </div>
                    <div className="space-y-2">
                      {['Sarah K.', 'Ahmed R.', 'Lisa M.'].map((name, i) => (
                        <div key={name} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">{name[0]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <span className="text-xs font-medium">{name}</span>
                              <span className="text-[10px] text-muted-foreground">{['2m', '15m', '1h'][i]}</span>
                            </div>
                            <div className="h-2.5 w-3/4 bg-slate-50 rounded mt-1" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">Features</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to automate
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              From instant AI replies to per-contact control, ChatPilot gives you full power over your WhatsApp business.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-slate-200/60 bg-white p-6 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 sm:py-28 gradient-bg gradient-mesh">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">How it works</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-foreground">
              Up and running in minutes
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              No coding, no complicated setup. Just sign up, connect, and let AI do the talking.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                custom={i}
                className="relative rounded-2xl bg-white border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl font-black text-emerald-100 mb-3">{s.num}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Chat demo */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">See it in action</motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Your AI handles the conversation naturally
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="mt-4 text-muted-foreground text-lg leading-relaxed">
                Customers won&apos;t even know they&apos;re talking to a bot. ChatPilot understands context, remembers preferences, and responds like a real person.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8 space-y-4">
                {[
                  'Understands Urdu, English, and mixed languages',
                  'Books appointments via cal.com integration',
                  'Shares business info, pricing, and media files',
                  'Hands off to you when toggled off per contact',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(16,185,129)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Chat mockup */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="rounded-2xl border border-slate-200/80 shadow-xl bg-[#f0f2f5] overflow-hidden max-w-sm mx-auto">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Al-Shifa Clinic</p>
                    <p className="text-emerald-100 text-xs">online</p>
                  </div>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-3">
                  <ChatBubble side="left" text="Hi, I want to book an appointment for tomorrow" time="10:32 AM" />
                  <ChatBubble side="right" label="AI Bot" text="Hello! I'd be happy to help you book an appointment. We have the following slots available tomorrow:" time="10:32 AM" />
                  <ChatBubble side="right" label="AI Bot" text="1. 9:00 AM - Dr. Ahmed&#10;2. 11:30 AM - Dr. Sara&#10;3. 2:00 PM - Dr. Ahmed&#10;&#10;Which time works best for you?" time="10:32 AM" />
                  <ChatBubble side="left" text="11:30 AM please" time="10:33 AM" />
                  <ChatBubble side="right" label="AI Bot" text="Done! Your appointment with Dr. Sara is confirmed for tomorrow at 11:30 AM. You'll receive a reminder. See you then!" time="10:33 AM" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl gradient-primary overflow-hidden px-8 py-16 sm:px-16 sm:py-20 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.06%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to automate your<br />WhatsApp business?
              </h2>
              <p className="mt-5 text-emerald-100 text-lg max-w-xl mx-auto">
                Join businesses that save hours every day with ChatPilot. Set up in under 5 minutes.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="w-full sm:w-auto bg-white text-emerald-700 font-semibold px-8 py-3.5 rounded-xl text-base hover:bg-emerald-50 transition-colors shadow-lg flex items-center justify-center gap-2">
                  Start Free Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
                <Link href="/login" className="w-full sm:w-auto text-white font-semibold px-8 py-3.5 rounded-xl text-base border border-white/30 hover:bg-white/10 transition-colors flex items-center justify-center">
                  Log in to Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg gradient-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-sm font-semibold text-foreground">ChatPilot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChatPilot. Built for businesses that value their time.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ChatBubble({ side, text, time, label }: { side: 'left' | 'right'; text: string; time: string; label?: string }) {
  return (
    <div className={`flex ${side === 'left' ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 shadow-sm ${
        side === 'left'
          ? 'bg-white text-foreground rounded-tl-md'
          : 'bg-emerald-500 text-white rounded-tr-md'
      }`}>
        {label && <p className="text-[10px] font-medium text-emerald-200 mb-0.5">{label}</p>}
        <p className="text-[13px] leading-relaxed whitespace-pre-line">{text}</p>
        <p className={`text-[10px] mt-1 text-right ${side === 'left' ? 'text-slate-400' : 'text-emerald-200'}`}>{time}</p>
      </div>
    </div>
  )
}
