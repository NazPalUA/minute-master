export async function AnalyticCardContent({
  dataPromise,
  description
}: {
  dataPromise: Promise<{ value: string; change?: string }>
  description?: string
}) {
  const { value, change } = await dataPromise
  const hasAdditionalInfo = change || description

  return (
    <>
      <div className="text-2xl font-bold">{value}</div>
      {hasAdditionalInfo && (
        <p className="text-muted-foreground text-xs">
          {change ? `${change} ${description}` : description}
        </p>
      )}
    </>
  )
}
