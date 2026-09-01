import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * True when a polled thread is identical to the one already rendered. Polling
 * returns a fresh array every time; keeping the previous reference when nothing
 * changed stops React re-rendering the whole conversation every few seconds.
 */
export function isSameThread(
  a: { id: number }[],
  b: { id: number }[],
): boolean {
  if (a.length !== b.length) return false
  if (a.length === 0) return true
  return a[a.length - 1].id === b[b.length - 1].id && a[0].id === b[0].id
}
