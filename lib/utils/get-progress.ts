export function getProgress(totalRuntime: number, estimatedTime?: number) {
  const progress =
    estimatedTime && estimatedTime > 0
      ? Math.min((totalRuntime / estimatedTime) * 100, 100)
      : 0

  return Math.round(progress)
}
