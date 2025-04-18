export const formatTimeUnit = (
  value: number,
  label: string,
  labelSeparator: string = ''
): string => {
  const formattedValue = `${value}${labelSeparator}${label}`
  return formattedValue.padStart(
    value < 10 ? 4 + labelSeparator.length : 3 + labelSeparator.length,
    ' '
  )
}
