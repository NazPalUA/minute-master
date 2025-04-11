import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'
import { Suspense } from 'react'
import { Skeleton } from './ui/skeleton'

export type AnalyticsCardProps = {
  title: string
  dataPromise: Promise<{ value: string; change?: string }>
  description?: string
  icon: LucideIcon
}

type Props = {
  analytics: AnalyticsCardProps[]
  className?: string
}

export function AnalyticsCards({ analytics, className }: Props) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {analytics.map((card, index) => (
        <AnalyticCard key={index} card={card} />
      ))}
    </div>
  )
}

function AnalyticCard({ card }: { card: AnalyticsCardProps }) {
  const { title, icon: Icon, description } = card

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Suspense fallback={<ContentFallback description={description} />}>
          <Content card={card} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function Content({ card }: { card: AnalyticsCardProps }) {
  const { value, change } = await card.dataPromise
  const hasAdditionalInfo = change || card.description

  return (
    <>
      <div className="text-2xl font-bold">{value}</div>
      {hasAdditionalInfo && (
        <p className="text-muted-foreground text-xs">
          {change ? `${change} ${card.description}` : card.description}
        </p>
      )}
    </>
  )
}

function ContentFallback({ description }: { description?: string }) {
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
