export function isoWeekToDate(isoWeekString: string) {
  // Format: YYYY-WXX
  const [yearStr, weekStr] = isoWeekString.split('-W')
  const year = parseInt(yearStr, 10)
  const week = parseInt(weekStr, 10)

  // Get January 4th of the year (it's always in week 1)
  const jan4th = new Date(year, 0, 4)

  // Get the Monday of week 1
  const mondayOfWeek1 = new Date(jan4th)
  mondayOfWeek1.setDate(jan4th.getDate() - (jan4th.getDay() || 7) + 1)

  // Add the appropriate number of weeks
  const targetDate = new Date(mondayOfWeek1)
  targetDate.setDate(mondayOfWeek1.getDate() + (week - 1) * 7)

  return targetDate
}
