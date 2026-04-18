import type { Metadata } from "next"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"
import { Section, SectionHeading, Eyebrow } from "@/components/marketing/section"
import { FinalCTA } from "@/components/marketing/cta"

export const metadata: Metadata = {
  title: "How it works — ChatPilot",
  description:
    "See exactly what happens when a customer sends a WhatsApp message: Baileys connector, NestJS orchestrator, Google Gemini reasoning, and your live dashboard.",
}

export const dynamic = "force-static"

const steps = [
  {
    number: "01",
    title: "Sign up",
    description: "Phone number and a password. You're in.",
    detail:
      "We create your company workspace. No credit card, no email verification dance. You land on the setup wizard.",
    panel: (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Sign up</div>
        <div className="space-y-3">
          <div className="h-10 rounded-lg bg-slate-100" />
          <div className="h-10 rounded-lg bg-slate-100" />
          <div className="h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600" />
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "Describe your business",
    description: "One paragraph. We build a custom AI prompt.",
    detail:
      "You write a short description of what you do, your hours, your tone. ChatPilot turns that into a tuned system prompt — you can edit it anytime.",
    panel: (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Your prompt</div>
        <div className="rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-emerald-200">
          <span className="text-emerald-400">{`//`}</span> auto-generated
          <br />
          You are the receptionist at Bright Clinic. Open 9-6 Mon-Sat. Urdu-friendly.
          Book dental appointments. Share the price list PDF when asked.
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "Scan the QR",
    description: "Pair your WhatsApp from Settings → Linked Devices.",
    detail:
      "ChatPilot connects to WhatsApp exactly like WhatsApp Web — as a linked device. Your phone stays connected, your existing chats aren't touched.",
    panel: (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">Pair device</div>
        <div className="mx-auto grid h-40 w-40 grid-cols-8 gap-0.5 rounded-lg bg-white p-2 ring-2 ring-slate-200">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className={Math.random() > 0.55 ? "aspect-square rounded-sm bg-slate-900" : "aspect-square rounded-sm bg-white"}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "04",
    title: "Go live",
    description: "Customers message you. Your AI does the rest.",
    detail:
      "From the first message onward, ChatPilot answers in real time. You watch every conversation from the dashboard and take over anytime.",
    panel: (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Live
        </div>
        <div className="space-y-2">
          <div className="rounded-lg bg-slate-100 p-2 text-xs">Customer: &ldquo;Can I book for tomorrow?&rdquo;</div>
          <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-900">AI: &ldquo;Yes — 11:30, 2:00, or 4:45?&rdquo;</div>
          <div className="rounded-lg bg-slate-100 p-2 text-xs">Customer: &ldquo;2pm&rdquo;</div>
          <div className="rounded-lg bg-emerald-50 p-2 text-xs text-emerald-900">AI: &ldquo;Booked ✅&rdquo;</div>
        </div>
      </div>
    ),
  },
]

const pipeline = [
  { label: "Customer", detail: "Sends a WhatsApp message", color: "from-slate-500 to-slate-700" },
  { label: "Baileys", detail: "Our WhatsApp connector", color: "from-emerald-500 to-teal-600" },
  { label: "NestJS API", detail: "Orchestrates the reply", color: "from-teal-500 to-cyan-600" },
  { label: "Gemini 2.5", detail: "Generates the answer", color: "from-cyan-500 to-indigo-600" },
  { label: "Dashboard", detail: "You watch it all live", color: "from-indigo-500 to-purple-600" },
]

export default function HowItWorksPage() {
  return (
    <main className="relative bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <MarketingNav />

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Eyebrow>How it works</Eyebrow>
          <h1 className="text-display font-bold tracking-tight text-slate-900">
            From zero to live in <span className="text-gradient">three minutes.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            No developers, no integrations, no migration. Here&apos;s the entire flow — front to back.
          </p>
        </div>
      </section>

      <Section>
        <div className="space-y-16">
          {steps.map((s, i) => (
            <div
              key={s.number}
              className={
                i % 2 === 0
                  ? "grid items-center gap-12 lg:grid-cols-2"
                  : "grid items-center gap-12 lg:grid-cols-2 [&>*:first-child]:lg:order-last"
              }
            >
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-glow">
                  {s.number}
                </div>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{s.title}</h2>
                <p className="mt-3 text-lg font-medium text-emerald-700">{s.description}</p>
                <p className="mt-4 text-slate-600">{s.detail}</p>
              </div>
              <div>{s.panel}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50/80">
        <SectionHeading
          eyebrow="Under the hood"
          title="The pipeline, top to bottom."
          subtitle="The full journey of a single customer message — in milliseconds."
        />
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {pipeline.map((p, i) => (
            <div key={p.label} className="flex flex-1 items-center gap-3">
              <div className="flex flex-1 flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${p.color} text-white`}>
                  <span className="text-xs font-bold">{i + 1}</span>
                </div>
                <div className="text-sm font-semibold text-slate-900">{p.label}</div>
                <div className="text-xs text-slate-500">{p.detail}</div>
              </div>
              {i < pipeline.length - 1 && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden h-5 w-5 shrink-0 text-slate-300 md:block">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </Section>

      <FinalCTA />
      <MarketingFooter />
    </main>
  )
}
