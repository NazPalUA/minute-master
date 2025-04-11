export const getResponsiveTextSize = (
  containerSize: number,
  thresholds: [number, string][],
  defaultClass: string
): string => {
  for (const [threshold, className] of thresholds) {
    if (containerSize < threshold) {
      return className
    }
  }
  return defaultClass
}
