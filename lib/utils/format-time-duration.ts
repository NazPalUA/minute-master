export function formatTimeDuration(
  ms: number,
  dict: { hrs: string; mins: string }
) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)

  const parts = []

  if (hours > 0) {
    parts.push(`${hours}${dict.hrs}`.padStart(hours < 10 ? 3 : 2, ' '))
  }

  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes}${dict.mins}`.padStart(minutes < 10 ? 4 : 3, ' '))
  }

  return parts.join(' ').replace(/ /g, '\u00A0') // &nbsp; for consistent spacing
}
