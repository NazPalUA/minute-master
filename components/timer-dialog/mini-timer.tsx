'use client'

import { TimeCounterContext } from '@/components/timer-dialog/time-counter-context'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants/routes'
import { padAndJoinTimeValues } from '@/lib/utils/format-time'
import { Maximize2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { use } from 'react'
import { useTimerDialogQueryState } from './lib/use-timer-dialog-query-state'

export function MiniTimer() {
  const {
    totalDuration: { hours, minutes, seconds },
    runningTimer
  } = use(TimeCounterContext)
  const { isOpen, openDialog } = useTimerDialogQueryState()

  const pathname = usePathname()
  const { lang } = useDictionary()

  if (isOpen || !runningTimer || pathname === ROUTES.DASHBOARD.TIMER(lang))
    return null

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50">
      <Button
        size="lg"
        onClick={openDialog}
        aria-label="Maximize timer"
        className="ml-auto flex h-auto max-w-[350px] min-w-[200px] items-center gap-4 px-5 py-2 whitespace-normal"
      >
        <div className="text-start">
          <strong className="line-clamp-1 text-lg">
            {runningTimer.project.name}
          </strong>

          <p className="text-muted-foreground text-md line-clamp-1">
            {runningTimer.section.name +
              (runningTimer?.task ? ` - ${runningTimer.task.name}` : '')}
          </p>
        </div>

        <span className="-translate-y-0.5 text-2xl font-bold">
          {padAndJoinTimeValues(hours, minutes, seconds)}
        </span>
        <Maximize2 className="size-5" />
      </Button>
    </div>
  )
}
