'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useDictionary } from '@/hooks'
import { useTimerDialogQueryState } from './lib/use-timer-dialog-query-state'

type Props = {
  children: React.ReactNode
}

export function TimerDialogContainer({ children }: Props) {
  const { isOpen, toggleDialog } = useTimerDialogQueryState()
  const { dashboard: dashboardDict } = useDictionary()

  return (
    <Dialog open={isOpen} onOpenChange={toggleDialog}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{dashboardDict.timer.label}</DialogTitle>
          <DialogDescription className="sr-only">
            {dashboardDict.timer.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
