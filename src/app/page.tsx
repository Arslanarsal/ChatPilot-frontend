import type { Metadata } from "next"
import Link from "next/link"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"
import { ChatDemo } from "@/components/marketing/chat-demo"
import { Section, SectionHeading, Eyebrow } from "@/components/marketing/section"
import { FeatureCard } from "@/components/marketing/feature-card"
import { Faq } from "@/components/marketing/faq"
import { FinalCTA } from "@/components/marketing/cta"
import { VideoShowcase } from "@/components/marketing/video-showcase"

export const metadata: Metadata = {
  title: "ChatPilot — Your business on WhatsApp autopilot",
  description:
    "AI-powered WhatsApp assistant for service businesses. Answers customers 24/7, books appointments on cal.com, handles Urdu + English, and hands off to you when it matters.",
  openGraph: {
    title: "ChatPilot — Your business on WhatsApp autopilot",
    description:
      "AI-powered WhatsApp assistant for service businesses. Replies 24/7, books appointments, speaks Urdu + English.",
    type: "website",
  },
}

const benefits = [
  {
    title: "Replies in under a second",
    description:
      "Customers get answers instantly, even at 3am. No more lost leads to the next-fastest business.",
  },
  {
    title: "Books appointments for you",
    description:
      "Connected to cal.com. Shows real availability, confirms the slot, adds it to your calendar.",
  },
  {
    title: "Speaks Urdu + English",
    description:
      "Handles mixed-language messages natively. Your customer writes how they talk.",
  },
  {
    title: "You stay in control",
    description:
      "Flip the bot off per-contact with one tap when you want to reply yourself. It never fights you.",
  },
]

const features = [
  {
    title: "AI replies",
    description:
      "Google Gemini understands your business prompt and answers exactly like you would.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    title: "Per-contact override",
    description:
      "Stop the bot for one customer without affecting anyone else. Human takeover in one tap.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    title: "Your real WhatsApp",
    description:
      "Customers message your actual number. No third-party sender ID. No API limitations.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M3 12a9 9 0 1 0 3.2-6.9L3 8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Voice note transcription",
    description:
      "Customer sends a voice note? The AI listens, understands, and replies in text instantly.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 10a7 7 0 0 0 14 0M12 19v3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Asset library",
    description:
      "Upload PDFs, photos, or price lists. The AI shares them with customers when relevant.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M4 4h16v5H4zM4 11h16v9H4z" />
        <path d="M8 15h8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Live dashboard",
    description:
      "See every conversation, filter by contact, watch message volume trend by the hour.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M3 3v18h18" strokeLinecap="round" />
        <path d="M7 14l4-4 4 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const steps = [
  { title: "Sign up", description: "Phone number and password. Takes 30 seconds." },
  { title: "Describe your business", description: "One paragraph. We turn it into a custom AI system prompt." },
  { title: "Scan the QR", description: "Pair your WhatsApp from Settings → Linked Devices." },
  { title: "Go live", description: "Customers message you as usual. Your AI handles the rest." },
]

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect to test the waters.",
    features: ["1 WhatsApp number", "200 AI replies / month", "1 team member"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "Rs. 3,500",
    suffix: "/month",
    description: "For growing service businesses.",
    features: [
      "1 WhatsApp number",
      "Unlimited AI replies",
      "Appointment booking",
      "File attachments",
      "Priority support",
    ],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "Custom",
    description: "Multiple numbers, team seats, SSO.",
    features: ["Multiple WhatsApp numbers", "Team seats", "Custom integrations", "SLA & dedicated support"],
    cta: "Talk to sales",
  },
]

const faqItems = [
  {
    q: "Will my customers know they're talking to a bot?",
    a: "Only if you tell them. Replies come from your actual WhatsApp number with your business name — identical to a human reply. Most businesses use a short disclosure in their first bot reply out of transparency.",
  },
  {
    q: "What happens if the AI doesn't know the answer?",
    a: "It automatically flags the conversation for human review and pauses itself for that contact. You get a notification, reply yourself, and re-enable the bot when you're ready.",
  },
  {
    q: "Does it work with my existing WhatsApp Business app?",
    a: "Yes. ChatPilot pairs as a linked device — the same way WhatsApp Web works. Your phone stays connected, your existing chats aren't touched, and you can unlink anytime.",
  },
  {
    q: "Can it book appointments to my real calendar?",
    a: "Yes, via cal.com integration. The AI queries your live availability, proposes slots, confirms with the customer, and creates the booking — all inside the chat.",
  },
  {
    q: "Is my data secure?",
    a: "Messages are stored encrypted in our database. We never share or sell data. You can delete your account and wipe all conversations at any time from Settings.",
  },
  {
    q: "What about voice notes?",
    a: "The AI transcribes them instantly using Google Gemini and replies in text — the customer's intent is preserved whether they typed or spoke.",
  },
]

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white">
      <MarketingNav />

      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <Eyebrow>Now with Google Gemini 2.5</Eyebrow>
            <h1 className="text-hero font-bold tracking-tight text-slate-900">
              Your business on{" "}
              <span className="text-gradient">autopilot</span>
              <br />
              while you sleep.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              ChatPilot pairs to your WhatsApp and runs an AI that answers
              customers, books appointments, and keeps your business alive 24/7 —
              in English and Urdu, on your real number.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 px-7 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Start free — 3 min setup
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-2 h-4 w-4">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#demo"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-7 text-sm font-semibold text-slate-900 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              >
                See live demo
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-500">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" />
                </svg>
                No credit card
              </div>
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-emerald-500">
                  <path d="M9 16.2 4.8 12l-1.4 1.4L9 19l12-12-1.4-1.4z" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>

          <div id="demo" className="flex justify-center lg:justify-end">
            <ChatDemo />
          </div>
        </div>
      </section>

      <div className="border-y border-slate-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8 text-sm text-slate-500">
          <span className="font-medium">Built on</span>
          <span className="font-semibold text-slate-700">WhatsApp</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="font-semibold text-slate-700">Google Gemini</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="font-semibold text-slate-700">cal.com</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="font-semibold text-slate-700">NestJS + Next.js</span>
        </div>
      </div>

      <Section>
        <SectionHeading
          eyebrow="See the whole product"
          title={<>Problem, setup, and control — in 74 seconds.</>}
          subtitle="From why it exists to how you run it, every step is in this clip."
        />
        <VideoShowcase />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Why ChatPilot"
          title={<>Every message answered. Every appointment booked.</>}
          subtitle="Built for clinics, salons, and service businesses drowning in WhatsApp messages."
        />
        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="mb-4 text-5xl font-bold text-slate-200">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="text-xl font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-slate-600">{b.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50/80">
        <SectionHeading
          eyebrow="Features"
          title="Everything a real customer conversation needs."
          subtitle="No chatbots from 2015. This is a grown-up AI that respects your customers' time."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} index={i} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="Four steps. Three minutes."
          subtitle="No developers, no integrations, no migration."
        />
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-lg font-bold text-emerald-700">
                {i + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.description}</p>
              {i < steps.length - 1 && (
                <div className="absolute left-14 top-6 hidden h-px w-[calc(100%-3.5rem)] bg-gradient-to-r from-emerald-300 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            See the full flow
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Section>

      <Section className="bg-slate-50/80">
        <SectionHeading
          eyebrow="Pricing"
          title="Start free. Upgrade when you grow."
          subtitle="Simple tiers. No per-message fees. No surprises."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {pricingTiers.map((t) => (
            <div
              key={t.name}
              className={
                t.highlight
                  ? "relative rounded-3xl border-2 border-emerald-500 bg-white p-8 shadow-glow-lg"
                  : "rounded-3xl border border-slate-200 bg-white p-8"
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-900">{t.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">{t.price}</span>
                {t.suffix && <span className="text-sm text-slate-500">{t.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-slate-600">{t.description}</p>
              <Link
                href="/signup"
                className={
                  t.highlight
                    ? "mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    : "mt-6 inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-900 hover:border-emerald-300 hover:bg-emerald-50"
                }
              >
                {t.cta}
              </Link>
              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-700">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Compare all plans
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Answers to the usual questions." />
        <Faq items={faqItems} />
      </Section>

      <FinalCTA />
      <MarketingFooter />
    </main>
  )
}
