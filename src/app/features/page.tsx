import type { Metadata } from "next"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"
import { Section, Eyebrow } from "@/components/marketing/section"
import { FinalCTA } from "@/components/marketing/cta"

export const metadata: Metadata = {
  title: "Features — ChatPilot",
  description:
    "Everything ChatPilot ships with: AI replies on Gemini 2.5, cal.com appointment booking, per-contact bot control, voice transcription, asset sharing, and a live dashboard.",
}

export const dynamic = "force-static"

type Feature = {
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  visual: React.ReactNode
  reverse?: boolean
}

const featureList: Feature[] = [
  {
    eyebrow: "AI assistant",
    title: "An AI that knows your business.",
    description:
      "Paste a description of your business and we generate a custom system prompt. Powered by Google Gemini 2.5 Flash with tool-calling and multi-turn reasoning.",
    bullets: [
      "Urdu, English, and mixed-language handling",
      "Custom tone matched to your brand",
      "Remembers context across the full conversation",
    ],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Generating prompt…
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-900 p-4 text-xs leading-relaxed text-emerald-200">
{`You are the friendly receptionist at Bright Clinic.
Speak warmly in Urdu or English depending on the customer.
Always ask for their name if unknown.
Book dental appointments via cal.com.
Share the price list PDF when asked about fees.`}
        </pre>
      </div>
    ),
  },
  {
    eyebrow: "Appointment booking",
    title: "Bookings confirmed inside the chat.",
    description:
      "Connect your cal.com and ChatPilot queries real availability, proposes slots, confirms the customer's choice, and writes the booking back to your calendar.",
    bullets: [
      "Live slot queries — never double-books",
      "Automatic email + WhatsApp reminders",
      "One-line cancellation flow",
    ],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 text-xs font-semibold text-slate-500">TOMORROW — AVAILABLE SLOTS</div>
        <div className="space-y-2">
          {["11:30 AM", "2:00 PM", "4:45 PM"].map((t, i) => (
            <div
              key={t}
              className={
                i === 1
                  ? "flex items-center justify-between rounded-xl border-2 border-emerald-500 bg-emerald-50 p-3"
                  : "flex items-center justify-between rounded-xl border border-slate-200 p-3"
              }
            >
              <span className="text-sm font-medium text-slate-900">{t}</span>
              {i === 1 ? (
                <span className="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-white">Booked</span>
              ) : (
                <span className="text-xs text-slate-500">Open</span>
              )}
            </div>
          ))}
        </div>
      </div>
    ),
    reverse: true,
  },
  {
    eyebrow: "Per-contact override",
    title: "Take over any chat with one tap.",
    description:
      "Flip the bot off for a single customer without affecting everyone else. When the AI doesn't know something, it pauses itself and pings you.",
    bullets: [
      "Toggle per-contact from the dashboard",
      "AI auto-pauses on 'needs review' flag",
      "Notification when human takeover is needed",
    ],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="space-y-3">
          {[
            { name: "Amina Khalid", active: true },
            { name: "Bilal Ahmad", active: false },
            { name: "Sana Iqbal", active: true },
          ].map((c) => (
            <div key={c.name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                <span className="text-sm font-medium text-slate-900">{c.name}</span>
              </div>
              <div
                className={
                  c.active
                    ? "relative h-6 w-11 rounded-full bg-emerald-500 transition-colors"
                    : "relative h-6 w-11 rounded-full bg-slate-300 transition-colors"
                }
              >
                <span
                  className={
                    c.active
                      ? "absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow"
                      : "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Voice transcription",
    title: "Voice notes, understood instantly.",
    description:
      "The AI transcribes voice messages with Gemini's native audio model, then replies in text — customers who prefer to talk, get served just as fast.",
    bullets: [
      "Accepts voice notes in any language",
      "Replies in text for clarity",
      "No separate setup required",
    ],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center gap-3 rounded-2xl bg-[#005c4b] p-3 text-white">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <div className="flex flex-1 items-center gap-0.5">
            {Array.from({ length: 28 }).map((_, i) => (
              <span
                key={i}
                style={{ height: `${6 + (i % 5) * 3}px` }}
                className="block w-0.5 rounded-full bg-white/80"
              />
            ))}
          </div>
          <span className="text-xs text-white/70">0:07</span>
        </div>
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">Transcribed</div>
          &ldquo;Assalamu alaikum, kya aap ke paas kal shaam ka time hai?&rdquo;
        </div>
      </div>
    ),
    reverse: true,
  },
  {
    eyebrow: "Live dashboard",
    title: "Every conversation, one view.",
    description:
      "Watch the bot work in real time. Filter by contact, search messages, see volume trends hour-by-hour.",
    bullets: [
      "Real-time conversation feed",
      "Contact-level message history",
      "7-day message volume chart",
    ],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Active contacts", value: "247" },
            { label: "Messages / 24h", value: "1,842" },
            { label: "Bookings / wk", value: "63" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-slate-50 p-4">
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 300 80" className="mt-4 h-20 w-full">
          <polyline
            points="0,60 30,55 60,45 90,50 120,35 150,40 180,25 210,30 240,20 270,15 300,22"
            fill="none"
            stroke="url(#g1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
  },
  {
    eyebrow: "Asset library",
    title: "Share files without leaving the chat.",
    description:
      "Upload menus, brochures, or photos. The AI picks the right one and sends it when a customer asks.",
    bullets: ["PDFs, images, videos", "Per-file description for the AI", "Instant share in WhatsApp"],
    visual: (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="grid grid-cols-3 gap-3">
          {[
            { ext: "PDF", label: "Price list" },
            { ext: "JPG", label: "Clinic map" },
            { ext: "MP4", label: "Intro video" },
          ].map((a) => (
            <div key={a.label} className="rounded-xl border border-slate-200 p-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                {a.ext}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-700">{a.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    reverse: true,
  },
]

export default function FeaturesPage() {
  return (
    <main className="relative bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <MarketingNav />

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Eyebrow>Features</Eyebrow>
          <h1 className="text-display font-bold tracking-tight text-slate-900">
            Every conversation. <span className="text-gradient">Answered.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            ChatPilot isn&apos;t a chatbot. It&apos;s a full-stack AI teammate for your WhatsApp —
            built to handle the nuance, speed, and volume of real customer conversations.
          </p>
        </div>
      </section>

      {featureList.map((f, i) => (
        <Section key={f.title} className={i % 2 === 1 ? "bg-slate-50/80" : ""}>
          <div
            className={
              f.reverse
                ? "grid items-center gap-12 lg:grid-cols-2 [&>*:first-child]:order-last"
                : "grid items-center gap-12 lg:grid-cols-2"
            }
          >
            <div>
              <Eyebrow>{f.eyebrow}</Eyebrow>
              <h2 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                {f.title}
              </h2>
              <p className="mt-4 text-lg text-slate-600">{f.description}</p>
              <ul className="mt-6 space-y-3">
                {f.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-slate-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>{f.visual}</div>
          </div>
        </Section>
      ))}

      <FinalCTA />
      <MarketingFooter />
    </main>
  )
}
