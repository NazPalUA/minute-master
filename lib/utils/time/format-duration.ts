import { formatTimeUnit } from './format-time-unit'
import { millisecondsToTimeParts } from './milliseconds-to-time-parts'

type DurationLabels = {
  hours?: string
  minutes?: string
  seconds?: string
}

type FormatOptions = {
  space: string
  labelSeparator: string
  zeroDisplay: boolean
}

const DEFAULT_OPTIONS: FormatOptions = {
  space: ' ',
  labelSeparator: '',
  zeroDisplay: true
}

export function formatDuration(
  ms: number,
  labels: DurationLabels,
  options: Partial<FormatOptions> = {}
): string {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const { space, labelSeparator, zeroDisplay } = mergedOptions
  const { hours, minutes, seconds } = millisecondsToTimeParts(ms)

  const parts: string[] = []

  if ((hours > 0 || zeroDisplay) && labels.hours) {
    parts.push(formatTimeUnit(hours, labels.hours, labelSeparator))
  }

  if ((minutes > 0 || zeroDisplay) && labels.minutes) {
    parts.push(formatTimeUnit(minutes, labels.minutes, labelSeparator))
  }

  if ((seconds > 0 || zeroDisplay) && labels.seconds) {
    parts.push(formatTimeUnit(seconds, labels.seconds, labelSeparator))
  }

  // Replace spaces with non-breaking spaces for consistent display
  return parts.join(space).replace(/ /g, '\u00A0') || '0'
}
