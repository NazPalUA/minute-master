function generateDistinctColors(
  count: number,
  saturation = 70,
  lightness = 50
): string[] {
  const hues = Array.from(
    { length: count },
    (_, i) => (i * (360 / count)) % 360
  )

  return hues.map(hue => `hsl(${hue}, ${saturation}%, ${lightness}%)`)
}

export function getChartColorsArr(length: number) {
  const preDefinedColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--chart-6)',
    'var(--chart-7)',
    'var(--chart-8)',
    'var(--chart-9)',
    'var(--chart-10)'
  ]

  if (length <= preDefinedColors.length) {
    return preDefinedColors.slice(0, length)
  }

  return generateDistinctColors(length)
}
