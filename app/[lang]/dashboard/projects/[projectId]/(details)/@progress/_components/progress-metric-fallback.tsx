import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

type Props = {
  icon: React.ReactNode
  title: string
}

export function ProgressMetricFallback({ icon, title }: Props) {
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-amber-500">
          <AlertCircle className="h-3 w-3" />
          <span>
            <Skeleton className="h-4 w-16" />
          </span>
        </div>
      </div>

      <Progress value={0} className="bg-primary/50 h-2.5 animate-pulse" />
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          <Skeleton className="h-4 w-10" />
        </span>
        <span>
          <Skeleton className="h-4 w-10" />
        </span>
      </div>
    </div>
  )
}
