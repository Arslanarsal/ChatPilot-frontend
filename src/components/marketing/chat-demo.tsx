"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Message = {
  from: "customer" | "bot"
  text: string
  time: string
}

const script: Message[] = [
  { from: "customer", text: "Hi, do you have appointments available tomorrow?", time: "10:14" },
  { from: "bot", text: "Hi! 👋 Yes — I have 11:30, 2:00, and 4:45 open tomorrow. Which works?", time: "10:14" },
  { from: "customer", text: "2pm please. My name is Amina.", time: "10:15" },
  { from: "bot", text: "Booked for Amina at 2:00 PM tomorrow ✅ You'll get a reminder an hour before.", time: "10:15" },
]

export function ChatDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full max-w-md rounded-[32px] bg-[#111b21] p-3 shadow-2xl ring-1 ring-black/20",
        className,
      )}
    >
      <div className="rounded-3xl bg-[#0b141a] overflow-hidden">
        <div className="flex items-center gap-3 bg-[#202c33] px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white font-semibold">
            BC
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">Bright Clinic</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              online
            </div>
          </div>
          <div className="flex gap-4 text-white/60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M15 3h6v6M14 10l7-7M10 21H4a2 2 0 0 1-2-2v-6" />
            </svg>
          </div>
        </div>

        <div
          className="space-y-2 px-4 py-6 min-h-[360px]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)",
          }}
        >
          {script.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.6, type: "spring", stiffness: 200, damping: 20 }}
              className={cn("flex", m.from === "bot" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[78%] rounded-2xl px-3 py-2 text-[13px] leading-snug shadow-md",
                  m.from === "bot"
                    ? "rounded-tr-sm bg-[#005c4b] text-white"
                    : "rounded-tl-sm bg-[#202c33] text-white",
                )}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/50">
                  <span>{m.time}</span>
                  {m.from === "bot" && (
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-emerald-300" fill="currentColor">
                      <path d="M6.5 10.5 3 7l1-1 2.5 2.5L12 3l1 1z" />
                      <path d="M10.5 10.5 7 7l1-1 2.5 2.5L15 3l1 1z" opacity=".7" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: script.length * 0.6 + 0.2 }}
            className="flex justify-start pt-2"
          >
            <div className="flex items-center gap-1 rounded-full bg-[#202c33] px-3 py-2">
              {[0, 0.15, 0.3].map((d) => (
                <motion.span
                  key={d}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: d }}
                  className="h-1.5 w-1.5 rounded-full bg-white/60"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-emerald-500/15 blur-3xl" />
    </div>
  )
}
