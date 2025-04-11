'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { Clock } from 'lucide-react'

export function ChartNoDataFallback() {
  const { common: dict } = useDictionary()
  return (
    <div className="flex h-[300px] flex-col items-center justify-center p-8 text-center">
      <div className="bg-muted rounded-full p-3">
        <Clock className="text-muted-foreground h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-medium">
        {dict.errors.noDataInTimeRange}
      </h3>
    </div>
  )
}
