'use client'

import { useDictionary } from '@/hooks'
import { createManyTimeLogs as createManyTimeLogsAction } from '@/server/actions/create-many-time-logs'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

type Props = {
  closeDialog: () => void
  resetForm: () => void
}

export function useActionCreateManyTimeLogs({ closeDialog, resetForm }: Props) {
  const { 'time-log': timeLogDict } = useDictionary()

  return useAction(createManyTimeLogsAction, {
    onSuccess: () => {
      toast.success(timeLogDict.actions.create.success)
      closeDialog()
      resetForm()
    },
    onError: () => {
      toast.error(timeLogDict.actions.create.failure)
    }
  })
}
