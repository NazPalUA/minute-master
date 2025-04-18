import { Dictionary } from '@/localization'
import { millisecondsToTimeParts } from './milliseconds-to-time-parts'

export function formatTimeToHoursAndMinutes(
  timeInMs: number,
  dict: Dictionary['time']['units'],
  labelStyle: 'short' | 'long' | 'full' = 'short',
  space = ''
) {
  const { hours, minutes } = millisecondsToTimeParts(timeInMs)

  const labelMap = {
    short: { hours: dict.hour.symbol, minutes: dict.minute.symbol },
    long: { hours: dict.hour.shortPlural, minutes: dict.minute.shortPlural },
    full: { hours: dict.hour.plural, minutes: dict.minute.plural }
  }

  const labels = labelMap[labelStyle]

  return `${hours}${space}${labels.hours} ${minutes}${space}${labels.minutes}`
}
