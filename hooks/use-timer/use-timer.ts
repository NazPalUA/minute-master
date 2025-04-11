'use client'

import { useTimerQueryState } from '@/components/timer-dialog/lib/use-timer-query-state'
import { useDictionary } from '@/hooks'
import { CountTotalRuntimeReturn } from '@/server/data/count-total-runtime'
import { GetRunningTimerReturn } from '@/server/data/get-running-timer'
import { useRef } from 'react'
import { toast } from 'sonner'
import { useActionCreateTimeLog } from './use-action-create-time-log'
import { useActionFinishTimeLog } from './use-action-finish-time-log'
import { useTimerUI } from './use-timer-ui'

export function useTimer(
  runningTimer: GetRunningTimerReturn,
  { total: totalTodayRuntimeInMs }: CountTotalRuntimeReturn
) {
  const { dashboard: dict } = useDictionary()

  // Keep reference to current timer state to avoid stale closures
  const runningTimerRef = useRef(runningTimer)

  // Update ref when props change
  if (runningTimerRef.current !== runningTimer) {
    runningTimerRef.current = runningTimer
  }

  const startedAt = runningTimer?.timeLog.startDate
  const startDate = startedAt ? new Date(startedAt) : undefined

  const { isRunning, sessionDuration, totalDuration, startTimer, stopTimer } =
    useTimerUI(totalTodayRuntimeInMs, startDate)

  const {
    setTimerSelector,
    timerSelector,
    loading: spLoading
  } = useTimerQueryState()

  // Store current timerSelector to avoid race conditions
  const timerSelectorRef = useRef(timerSelector)
  if (timerSelectorRef.current !== timerSelector) {
    timerSelectorRef.current = timerSelector
  }

  const { executeCreateTimeLog, isPendingCreateTimeLog } =
    useActionCreateTimeLog({
      totalTodayRuntimeInMs,
      startTimer
    })

  const { executeFinishTimeLog, isPendingFinishTimeLog } =
    useActionFinishTimeLog({
      runningTimer,
      totalTodayRuntimeInMs,
      stopTimer,
      startTimer,
      setTimerSelector
    })

  const handleStart = () => {
    if (runningTimerRef.current || isPendingCreateTimeLog) {
      toast.error(dict.timer.actions.start.failure.alreadyRunning)
      return
    }
    const currentSelector = timerSelectorRef.current
    if (!currentSelector?.proj || !currentSelector.sec) {
      toast.error(dict.timer.actions.start.failure.notSelected)
      return
    }
    executeCreateTimeLog({
      projectId: currentSelector.proj,
      sectionId: currentSelector.sec,
      taskId: currentSelector.task,
      startDate: new Date()
    })
  }

  const handleStop = () => {
    if (!runningTimerRef.current) {
      toast.error(dict.timer.actions.stop.failure.notRunning)
      return
    }

    executeFinishTimeLog({
      payload: {
        endDate: new Date()
      }
    })
  }

  const disabledStart =
    spLoading ||
    isPendingCreateTimeLog ||
    isPendingFinishTimeLog ||
    !timerSelector?.proj ||
    !timerSelector.sec ||
    isRunning

  const disabledStop =
    spLoading || isPendingCreateTimeLog || isPendingFinishTimeLog || !isRunning

  return {
    handleStart,
    handleStop,
    isPendingCreateTimeLog,
    isPendingFinishTimeLog,
    disabledStart,
    disabledStop,
    isRunning,
    sessionDuration,
    totalDuration,
    runningTimer,
    totalTodayRuntimeInMs
  }
}
