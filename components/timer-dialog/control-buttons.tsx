'use client'

import { TimeCounterContext } from '@/components/timer-dialog/time-counter-context'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { Pause, Play } from 'lucide-react'
import { use } from 'react'

export function ControlButtons() {
  const { handleStop, disabledStop, isRunning, handleStart, disabledStart } =
    use(TimeCounterContext)

  const { dashboard: dict } = useDictionary()

  if (isRunning) {
    return (
      <Button
        onClick={handleStop}
        variant={'destructive'}
        size="lg"
        className="w-full py-6 text-xl"
        disabled={disabledStop}
      >
        <Pause className="mr-2 h-6 w-6" />
        {dict.timer.actions.stop.trigger}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleStart}
      variant="default"
      size="lg"
      className="w-full py-6 text-xl"
      disabled={disabledStart}
    >
      <Play className="mr-2 h-6 w-6" />
      {dict.timer.actions.start.trigger}
    </Button>
  )
}
