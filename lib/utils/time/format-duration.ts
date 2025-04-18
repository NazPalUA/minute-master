import { Dictionary } from '@/localization'
import { formatTimeUnit } from './format-time-unit'
import { millisecondsToTimeParts } from './milliseconds-to-time-parts'

type FormatOptions = {
  labelLength: 'short' | 'long' | 'full'
  labelPlural: boolean
  units: ('hours' | 'minutes' | 'seconds')[]
  space: string
  labelSeparator: string
  zeroDisplay: boolean
}

const DEFAULT_OPTIONS: FormatOptions = {
  labelLength: 'long',
  labelPlural: true,
  units: ['hours', 'minutes'],
  space: ' ',
  labelSeparator: '',
  zeroDisplay: true
}

export function formatDuration(
  ms: number,
  dict: Dictionary['time']['units'],
  options: Partial<FormatOptions> = {}
): string {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options }
  const {
    space,
    labelSeparator,
    zeroDisplay,
    labelLength,
    labelPlural,
    units
  } = mergedOptions
  const { hours, minutes, seconds } = millisecondsToTimeParts(ms)

  const labelMap = {
    short: {
      hours: dict.hour.symbol,
      minutes: dict.minute.symbol,
      seconds: dict.second.symbol
    },
    long: {
      hours: labelPlural ? dict.hour.shortPlural : dict.hour.short,
      minutes: labelPlural ? dict.minute.shortPlural : dict.minute.short,
      seconds: labelPlural ? dict.second.shortPlural : dict.second.short
    },
    full: {
      hours: labelPlural ? dict.hour.plural : dict.hour.singular,
      minutes: labelPlural ? dict.minute.plural : dict.minute.singular,
      seconds: labelPlural ? dict.second.plural : dict.second.singular
    }
  }

  const labels = labelMap[labelLength]

  const parts: string[] = []

  if ((hours > 0 || zeroDisplay) && units.includes('hours')) {
    parts.push(
      formatTimeUnit(hours, labels.hours.toLowerCase(), labelSeparator)
    )
  }

  if ((minutes > 0 || zeroDisplay) && units.includes('minutes')) {
    parts.push(
      formatTimeUnit(minutes, labels.minutes.toLowerCase(), labelSeparator)
    )
  }

  if ((seconds > 0 || zeroDisplay) && units.includes('seconds')) {
    parts.push(
      formatTimeUnit(seconds, labels.seconds.toLowerCase(), labelSeparator)
    )
  }

  // Replace spaces with non-breaking spaces for consistent display
  return parts.join(space).replace(/ /g, '\u00A0') || '0'
}
