'use client'

import { useTimer } from '@/hooks'
import { CountTotalRuntimeReturn } from '@/server/data/count-total-runtime'
import { GetRunningTimerReturn } from '@/server/data/get-running-timer'
import { createContext } from 'react'

export type TimeCounterContextType = ReturnType<typeof useTimer>

export const TimeCounterContext = createContext<TimeCounterContextType>(
  {} as TimeCounterContextType
)

export function TimeCounterProvider({
  children,
  runningTimer,
  totalRuntime
}: {
  children: React.ReactNode
  runningTimer: GetRunningTimerReturn
  totalRuntime: CountTotalRuntimeReturn
}) {
  const timer = useTimer(runningTimer, totalRuntime)

  return (
    <TimeCounterContext.Provider value={timer}>
      {children}
    </TimeCounterContext.Provider>
  )
}
