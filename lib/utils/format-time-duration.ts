import { formatTimeUnit } from './format-time-unit'
import { millisecondsToTimeParts } from './time'

export function formatDuration(
  ms: number,
  dict: { hrs: string; mins: string }
) {
  const { hours, minutes } = millisecondsToTimeParts(ms)

  const parts = []

  if (hours > 0) {
    parts.push(formatTimeUnit(hours, dict.hrs))
  }

  if (minutes > 0 || hours === 0) {
    parts.push(formatTimeUnit(minutes, dict.mins))
  }

  return parts.join(' ').replace(/ /g, '\u00A0') // &nbsp; for consistent spacing
}
