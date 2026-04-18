import type { Metadata } from "next"
import Link from "next/link"
import { MarketingNav } from "@/components/marketing/nav"
import { MarketingFooter } from "@/components/marketing/footer"
import { Section, SectionHeading, Eyebrow } from "@/components/marketing/section"
import { Faq } from "@/components/marketing/faq"
import { FinalCTA } from "@/components/marketing/cta"

export const metadata: Metadata = {
  title: "Pricing — ChatPilot",
  description: "Simple pricing. Start free, upgrade when you grow. No per-message fees.",
}

export const dynamic = "force-static"

const tiers = [
  {
    name: "Starter",
    price: "Free",
    subtitle: "Forever free",
    description: "Perfect to test the waters.",
    features: ["1 WhatsApp number", "200 AI replies / month", "1 team member", "Community support"],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "Rs. 3,500",
    suffix: "/month",
    subtitle: "Billed monthly",
    description: "For growing service businesses.",
    features: [
      "1 WhatsApp number",
      "Unlimited AI replies",
      "Appointment booking (cal.com)",
      "File attachments",
      "Voice transcription",
      "Priority support",
    ],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "Custom",
    subtitle: "Annual contract",
    description: "Multiple numbers, team seats, SSO.",
    features: [
      "Multiple WhatsApp numbers",
      "Unlimited team seats",
      "SSO (Google, Microsoft)",
      "Custom integrations",
      "SLA & dedicated support",
      "Onboarding session",
    ],
    cta: "Talk to sales",
  },
]

const comparison = [
  { feature: "AI replies / month", starter: "200", pro: "Unlimited", business: "Unlimited" },
  { feature: "WhatsApp numbers", starter: "1", pro: "1", business: "Multiple" },
  { feature: "Team seats", starter: "1", pro: "3", business: "Unlimited" },
  { feature: "Appointment booking", starter: "—", pro: "✓", business: "✓" },
  { feature: "File attachments", starter: "—", pro: "✓", business: "✓" },
  { feature: "Voice transcription", starter: "✓", pro: "✓", business: "✓" },
  { feature: "Priority support", starter: "—", pro: "✓", business: "✓" },
  { feature: "SLA", starter: "—", pro: "—", business: "✓" },
  { feature: "SSO", starter: "—", pro: "—", business: "✓" },
  { feature: "Custom integrations", starter: "—", pro: "—", business: "✓" },
]

const pricingFaq = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Pro plans are month-to-month. Cancel from Settings and you'll keep access until the end of your billing period.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes. Pro comes with a 14-day free trial — no credit card required. We'll send a reminder before charging.",
  },
  {
    q: "Are there per-message fees?",
    a: "No. Your Pro plan covers unlimited AI replies. We don't charge per-message, per-contact, or per-booking.",
  },
  {
    q: "What about the Gemini API cost?",
    a: "It's included in your plan. We've absorbed the model cost so you never have to manage an API key.",
  },
  {
    q: "Can I switch tiers later?",
    a: "Yes, instantly. Upgrading prorates immediately; downgrading takes effect at the next billing cycle.",
  },
]

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mx-auto h-4 w-4 text-emerald-500">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PricingPage() {
  return (
    <main className="relative bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <MarketingNav />

      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <h1 className="text-display font-bold tracking-tight text-slate-900">
            One price. <span className="text-gradient">No surprises.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            Every plan includes the core AI. Upgrade when you need unlimited replies, bookings, or team seats.
          </p>
        </div>
      </section>

      <Section className="pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
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
              <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-slate-900">{t.price}</span>
                {t.suffix && <span className="text-sm text-slate-500">{t.suffix}</span>}
              </div>
              <p className="mt-3 text-sm text-slate-600">{t.description}</p>
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
              <ul className="mt-8 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-700">
                    <Check />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50/80">
        <SectionHeading eyebrow="Compare" title="See everything side-by-side." />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Feature</th>
                <th className="px-6 py-4 text-center font-semibold">Starter</th>
                <th className="bg-emerald-50 px-6 py-4 text-center font-semibold text-emerald-700">Pro</th>
                <th className="px-6 py-4 text-center font-semibold">Business</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparison.map((row) => (
                <tr key={row.feature}>
                  <td className="px-6 py-4 font-medium text-slate-900">{row.feature}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{row.starter}</td>
                  <td className="bg-emerald-50/50 px-6 py-4 text-center text-slate-900">{row.pro}</td>
                  <td className="px-6 py-4 text-center text-slate-600">{row.business}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="FAQ" title="Billing questions, answered." />
        <Faq items={pricingFaq} />
      </Section>

      <FinalCTA />
      <MarketingFooter />
    </main>
  )
}
