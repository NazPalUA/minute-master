'use client'

import { useDictionary } from '@/hooks'
import { createTimeLog } from '@/server/actions/create-time-log'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'
import { toast } from 'sonner'

type CreateTimeLogParams = {
  totalTodayRuntimeInMs: number
  startTimer(newBaseElapsedMs?: number, newStartTime?: Date): void
}

export function useActionCreateTimeLog({
  totalTodayRuntimeInMs,
  startTimer
}: CreateTimeLogParams) {
  const router = useRouter()
  const { dashboard: dict } = useDictionary()
  const totalTodayRuntimeRef = useRef(totalTodayRuntimeInMs)

  // Update ref when props change
  if (totalTodayRuntimeRef.current !== totalTodayRuntimeInMs) {
    totalTodayRuntimeRef.current = totalTodayRuntimeInMs
  }

  const { execute, isPending } = useAction(createTimeLog, {
    onExecute: () => {
      startTimer(totalTodayRuntimeRef.current, new Date())
    },
    onSuccess: data => {
      // toast.success(dict.dashboardSidebar.timer.start.success)
      startTimer(totalTodayRuntimeRef.current, new Date(data.input.startDate))
    },
    onError: () => {
      toast.error(dict.timer.actions.start.failure.general)
    },
    onSettled: () => {
      router.refresh()
    }
  })

  return {
    executeCreateTimeLog: execute,
    isPendingCreateTimeLog: isPending
  }
}
