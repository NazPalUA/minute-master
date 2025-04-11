'use client'

type Variant = 'sec' | 'min' | 'hrs'
type LabelLength = 'long' | 'short' | 'extraShort'

const MAX_VALUES = {
  sec: 60,
  min: 60,
  hrs: 24
} as const satisfies Record<Variant, number>

const LABEL_KEYS_UNIT = {
  sec: 'second',
  min: 'minute',
  hrs: 'hour'
} as const satisfies Record<Variant, string>

const LABEL_KEYS_LENGTH = {
  long: 'plural',
  short: 'shortPlural',
  extraShort: 'symbol'
} as const satisfies Record<LabelLength, string>

const TEXT_SIZE_THRESHOLDS = {
  value: [
    [100, 'text-xl'],
    [150, 'text-2xl'],
    [200, 'text-4xl'],
    [300, 'text-5xl']
  ] as [number, string][],
  label: [
    [100, 'text-xs'],
    [200, 'text-sm'],
    [300, 'text-base']
  ] as [number, string][]
} as const

export { LABEL_KEYS_LENGTH, LABEL_KEYS_UNIT, MAX_VALUES, TEXT_SIZE_THRESHOLDS }
export type { LabelLength, Variant }
