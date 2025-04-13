import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export function AnalyticCardContainer({
  children,
  title,
  Icon
}: {
  children: ReactNode
  title: string
  Icon: LucideIcon
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
