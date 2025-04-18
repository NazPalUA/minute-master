type TimeUnit = 'ms' | 's' | 'm' | 'h'

const conversionFactors = {
  'ms->s': 1 / 1000,
  's->ms': 1000,
  's->m': 1 / 60,
  'm->s': 60,
  'm->h': 1 / 60,
  'h->m': 60,
  'ms->m': 1 / (1000 * 60),
  'm->ms': 1000 * 60,
  'ms->h': 1 / (1000 * 60 * 60),
  'h->ms': 1000 * 60 * 60,
  's->h': 1 / (60 * 60),
  'h->s': 60 * 60
} as const

const convertTime = (from: TimeUnit, to: TimeUnit, value: number): number => {
  const factorKey = `${from}->${to}` as keyof typeof conversionFactors
  return Math.round(value * conversionFactors[factorKey])
}

// Public API
export const msToH = (ms: number) => convertTime('ms', 'h', ms)
export const hToMs = (hours: number) => convertTime('h', 'ms', hours)
export const sToH = (seconds: number) => convertTime('s', 'h', seconds)
export const hToS = (hours: number) => convertTime('h', 's', hours)
export const msToS = (ms: number) => convertTime('ms', 's', ms)
export const sToMs = (seconds: number) => convertTime('s', 'ms', seconds)
export const mToMs = (minutes: number) => convertTime('m', 'ms', minutes)
export const msToM = (ms: number) => convertTime('ms', 'm', ms)
export const mToS = (minutes: number) => convertTime('m', 's', minutes)
export const sToM = (seconds: number) => convertTime('s', 'm', seconds)
export const hToM = (hours: number) => convertTime('h', 'm', hours)
export const mToH = (minutes: number) => convertTime('m', 'h', minutes)
