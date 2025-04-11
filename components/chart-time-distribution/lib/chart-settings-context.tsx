'use client'

import { createContext, ReactNode } from 'react'
import { useChartSettings } from './use-chart-settings'

type ChartSettings = ReturnType<typeof useChartSettings>

export const ChartSettingsContext = createContext<ChartSettings>(
  {} as ChartSettings
)

export function ChartSettingsProvider({ children }: { children: ReactNode }) {
  const value = useChartSettings()

  return (
    <ChartSettingsContext.Provider value={value}>
      {children}
    </ChartSettingsContext.Provider>
  )
}
