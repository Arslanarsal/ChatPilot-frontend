import Link from "next/link"
import { cn } from "@/lib/utils"

export function LogoMark({ className, rounded = true }: { className?: string; rounded?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="cp-grad-nav" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      {rounded && <rect width="64" height="64" rx="14" fill="url(#cp-grad-nav)" />}
      <path
        d="M20 24a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v6a8 8 0 0 1-8 8h-9l-5 5v-5h-6l-1-1v-3z"
        fill={rounded ? "#ffffff" : "url(#cp-grad-nav)"}
      />
      <path
        d="M32 21l8 8M40 29h-6m6 0v-6"
        stroke={rounded ? "#10b981" : "#ffffff"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2", className)}>
      <LogoMark className="h-8 w-8 shadow-glow transition-transform group-hover:-rotate-3" />
      <span className="text-lg font-semibold tracking-tight text-foreground">ChatPilot</span>
    </Link>
  )
}
