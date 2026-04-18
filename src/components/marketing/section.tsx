import { cn } from "@/lib/utils"

export function Section({
  id,
  className,
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative w-full px-6 py-20 md:py-28", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  align?: "left" | "center"
}) {
  return (
    <div
      className={cn(
        "mb-14 flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-pretty text-lg text-slate-600">{subtitle}</p>
      )}
    </div>
  )
}
