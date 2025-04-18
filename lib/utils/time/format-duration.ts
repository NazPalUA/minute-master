import { Dictionary } from '@/localization'
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

const createLabelMap = (
  dict: Dictionary['time']['units'],
  labelPlural: boolean
) => ({
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
})

const formatTimeUnit = (
  value: number,
  label: string,
  labelSeparator: string
): string => {
  const formattedValue = `${value}${labelSeparator}${label}`
  return formattedValue.padStart(
    value < 10 ? 4 + labelSeparator.length : 3 + labelSeparator.length,
    ' '
  )
}

export function formatDuration(
  ms: number,
  dict: Dictionary['time']['units'],
  options: Partial<FormatOptions> = {}
): string {
  const {
    labelLength,
    labelPlural,
    units,
    space,
    labelSeparator,
    zeroDisplay
  } = { ...DEFAULT_OPTIONS, ...options }

  const timeValues = millisecondsToTimeParts(ms)
  const labels = createLabelMap(dict, labelPlural)[labelLength]

  const parts = units
    .filter(unit => zeroDisplay || timeValues[unit] > 0)
    .map(unit =>
      formatTimeUnit(
        timeValues[unit],
        labels[unit].toLowerCase(),
        labelSeparator
      )
    )

  // Replace spaces with non-breaking spaces for consistent display
  return parts.join(space).replace(/ /g, '\u00A0') || '0'
}
