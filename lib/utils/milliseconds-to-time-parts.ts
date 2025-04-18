export type TimeParts = {
  totalElapsedMs: number
  hours: number
  minutes: number
  seconds: number
}

export const millisecondsToTimeParts = (milliseconds: number): TimeParts => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    totalElapsedMs: milliseconds,
    hours,
    minutes,
    seconds
  }
}
