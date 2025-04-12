import { Progress } from '@/components/ui/progress'
import { AlertCircle } from 'lucide-react'

type Data = {
  value: number
  leftLabel: string
  rightLabel: string
  message?: string // Optional message to display when data is incomplete
}

type Props = {
  icon: React.ReactNode
  title: string
  dataPromise: Promise<Data>
}

export async function ProgressMetric({ icon, title, dataPromise }: Props) {
  const { value, leftLabel, rightLabel, message } = await dataPromise

  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {message && (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <AlertCircle className="h-3 w-3" />
            <span>{message}</span>
          </div>
        )}
      </div>

      <Progress value={value} className="h-2.5" />
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  )
}
