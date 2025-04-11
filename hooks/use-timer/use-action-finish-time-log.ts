'use client'

import { useDictionary } from '@/hooks'
import { finishTimeLog } from '@/server/actions/finish-time-log'
import { GetRunningTimerReturn } from '@/server/data/get-running-timer'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'

type TimerSelector = {
  proj: string
  sec: string
  task: string
}

type FinishTimeLogParams = {
  runningTimer: GetRunningTimerReturn
  totalTodayRuntimeInMs: number
  stopTimer(): void
  startTimer(newBaseElapsedMs?: number, newStartTime?: Date): void
  setTimerSelector(selector: TimerSelector): void
}

export function useActionFinishTimeLog({
  runningTimer,
  totalTodayRuntimeInMs,
  stopTimer,
  startTimer,
  setTimerSelector
}: FinishTimeLogParams) {
  const router = useRouter()
  const { dashboard: dict } = useDictionary()

  // Keep reference to current timer state to avoid stale closures
  const runningTimerRef = useRef(runningTimer)
  const totalTodayRuntimeRef = useRef(totalTodayRuntimeInMs)

  // Update refs when props change
  if (runningTimerRef.current !== runningTimer) {
    runningTimerRef.current = runningTimer
  }
  if (totalTodayRuntimeRef.current !== totalTodayRuntimeInMs) {
    totalTodayRuntimeRef.current = totalTodayRuntimeInMs
  }

  const { execute, isPending } = useAction(finishTimeLog, {
    onExecute: () => {
      // Store the current state before stopping
      if (runningTimerRef.current) {
        setTimerSelector({
          proj: runningTimerRef.current.project.projectId,
          sec: runningTimerRef.current.section.sectionId,
          task: runningTimerRef.current.task?.taskId || 'null'
        })
      }
      stopTimer()
    },
    // onSuccess: () => {
    //   toast.success(dict.timer.actions.stop.success)
    // },
    onError: () => {
      toast.error(dict.timer.actions.stop.failure.general)
      if (runningTimerRef.current?.timeLog?.startDate) {
        startTimer(
          totalTodayRuntimeRef.current,
          new Date(runningTimerRef.current.timeLog.startDate)
        )
      }
    },
    onSettled: () => {
      router.refresh()
    }
  })

  return {
    executeFinishTimeLog: execute,
    isPendingFinishTimeLog: isPending
  }
}
