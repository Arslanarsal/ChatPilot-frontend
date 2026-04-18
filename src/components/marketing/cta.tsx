import Link from "next/link"
import { Section } from "./section"

export function FinalCTA() {
  return (
    <Section className="pb-32">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 px-8 py-20 text-center shadow-glow-lg">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-emerald-300/30 blur-3xl animate-blob" />
        <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl animate-blob animation-delay-2000" />
        <div className="relative">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl">
            Stop losing leads at 2am.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-emerald-50/90">
            Pair your WhatsApp in under 3 minutes. Your AI replies to every customer,
            books appointments, and hands off to you only when it matters.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-semibold text-emerald-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              Start free — no credit card
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              See how it works
            </Link>
          </div>
        </div>
      </div>
    </Section>
  )
}
