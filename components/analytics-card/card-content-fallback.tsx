import { Skeleton } from '../ui/skeleton'

export function AnalyticCardContentFallback({
  description
}: {
  description?: string
}) {
  return (
    <>
      <div className="text-2xl font-bold">
        <Skeleton className="my-1 h-6 w-28" />
      </div>

      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <Skeleton className="h-4 w-12" />
        {description && (
          <span className="text-muted-foreground">{description}</span>
        )}
      </div>
    </>
  )
}
