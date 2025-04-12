'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { deleteTimeLog } from '@/server/actions/delete-time-log'
import { GetTimeLogsReturn } from '@/server/data/get-time-logs'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

export function useDeleteTimeLogAction(runtimes: GetTimeLogsReturn['data']) {
  const { 'time-log': timeLogDict } = useDictionary()

  return useOptimisticAction(deleteTimeLog, {
    currentState: runtimes,
    updateFn: (state, input) => {
      return state.filter(runtime => runtime.id !== input.timeLogId)
    },
    // onSuccess: () => {
    //   toast.success(timeLogDict.actions.delete.success)
    // },
    onError: () => {
      toast.error(timeLogDict.actions.delete.failure)
    }
    // onSettled: () => {
    //   router.refresh()
    // }
  })
}
