"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: false, margin: "-100px" })
  const [muted, setMuted] = useState(true)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!ref.current) return
    if (inView) {
      ref.current.play().catch(() => {})
      setPlaying(true)
    } else {
      ref.current.pause()
      setPlaying(false)
    }
  }, [inView])

  const togglePlay = () => {
    if (!ref.current) return
    if (ref.current.paused) {
      ref.current.play().catch(() => {})
      setPlaying(true)
    } else {
      ref.current.pause()
      setPlaying(false)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-to-br from-emerald-400/25 via-teal-400/10 to-cyan-400/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl ring-1 ring-emerald-500/10"
      >
        <div className="flex items-center gap-1.5 bg-slate-900/80 px-4 py-3 backdrop-blur">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-4 text-xs font-medium text-slate-400">chatpilot-demo.mp4 — 74s</span>
        </div>

        <div className="relative aspect-video">
          <video
            ref={ref}
            src="/chatpilot-demo.mp4"
            poster="/chatpilot-demo-poster.jpg"
            className="h-full w-full"
            loop
            muted={muted}
            playsInline
            preload="metadata"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M11 5 6 9H2v6h4l5 4z" strokeLinejoin="round" />
                  <path d="m23 9-6 6M17 9l6 6" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M11 5 6 9H2v6h4l5 4z" strokeLinejoin="round" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
