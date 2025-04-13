'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useDictionary } from '@/hooks'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { CardHeader } from './card-header'

type Props = {
  className?: string
  children: ReactNode
}

export function ChartTimeDistributionContainer({ className, children }: Props) {
  const { time: dict } = useDictionary()
  return (
    <Card className={cn('flex-1', className)}>
      <CardHeader title={dict.metrics.timeDistribution} />
      <CardContent className="h-full">{children}</CardContent>
    </Card>
  )
}
