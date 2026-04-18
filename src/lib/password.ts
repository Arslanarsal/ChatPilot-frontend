export type PasswordChecks = {
  len: boolean
  upper: boolean
  lower: boolean
  digit: boolean
  special: boolean
}

export type PasswordScore = {
  score: 0 | 1 | 2 | 3 | 4
  label: string
  color: string
  checks: PasswordChecks
  isStrong: boolean
}

export const PASSWORD_RULES = [
  { key: 'len', label: 'At least 8 characters' },
  { key: 'upper', label: 'One uppercase letter (A-Z)' },
  { key: 'lower', label: 'One lowercase letter (a-z)' },
  { key: 'digit', label: 'One number (0-9)' },
  { key: 'special', label: 'One special character (!@#$...)' },
] as const

export function checkPassword(pw: string): PasswordChecks {
  return {
    len: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
}

export function isStrongPassword(pw: string): boolean {
  const c = checkPassword(pw)
  return c.len && c.upper && c.lower && c.digit && c.special
}

export function scorePassword(pw: string): PasswordScore {
  const checks = checkPassword(pw)
  const passed = Object.values(checks).filter(Boolean).length
  let score: 0 | 1 | 2 | 3 | 4 = 0
  if (passed >= 2) score = 1
  if (passed >= 3) score = 2
  if (passed >= 4) score = 3
  if (passed === 5) score = 4

  const labels = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  const colors = ['bg-slate-300', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500']

  return {
    score,
    label: labels[score],
    color: colors[score],
    checks,
    isStrong: passed === 5,
  }
}

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const DIGIT = '0123456789'
const SPECIAL = '!@#$%^&*()-_=+[]{};:,.?'

function pick(set: string, rand: Uint32Array, idx: number): string {
  return set[rand[idx] % set.length]
}

export function generatePassword(length = 14): string {
  const total = Math.max(length, 8)
  const buf = new Uint32Array(total + 4)
  crypto.getRandomValues(buf)

  const chars: string[] = [
    pick(UPPER, buf, 0),
    pick(LOWER, buf, 1),
    pick(DIGIT, buf, 2),
    pick(SPECIAL, buf, 3),
  ]

  const all = UPPER + LOWER + DIGIT + SPECIAL
  for (let i = 4; i < total; i++) {
    chars.push(pick(all, buf, i))
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = buf[i] % (i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}
