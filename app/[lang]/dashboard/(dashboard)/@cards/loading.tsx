'use client'

import {
  AnalyticCardContainer,
  AnalyticCardContentFallback
} from '@/components/analytics-card'
import { useDictionary } from '@/hooks/use-dictionary'
import { getAnalyticsFallback } from './_lib/get-analytics-fallback'

export default function Loading() {
  const dict = useDictionary()

  const analytics = getAnalyticsFallback(dict)

  return analytics.map(data => {
    return (
      <AnalyticCardContainer
        key={data.title}
        Icon={data.icon}
        title={data.title}
      >
        <AnalyticCardContentFallback description={data.description} />
      </AnalyticCardContainer>
    )
  })
}
