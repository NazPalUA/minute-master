'use client'

import { LoadingSpinner } from '@/components/loading-spinner'
import { TimerDialogContainer } from '@/components/timer-dialog/timer-dialog-container'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks/use-dictionary'

export function TimerFallback() {
  const { common: commonDict } = useDictionary()

  return (
    <TimerDialogContainer>
      <div className="h-52 text-center">
        <LoadingSpinner size="lg" />
      </div>

      <Button
        variant="default"
        size="lg"
        className="w-full py-6 text-xl"
        disabled
      >
        {commonDict.status.loading}
      </Button>
    </TimerDialogContainer>
  )
}
