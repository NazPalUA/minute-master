'use client'

import { parseAsJson, useQueryState } from 'nuqs'
import { useTransition } from 'react'
import { timerSelectorSchema } from './schemas'

export function useTimerQueryState() {
  const [isTransitioning, startTransition] = useTransition()
  const [timerSelector, setTimerSelector] = useQueryState(
    'timer-selector',
    parseAsJson(timerSelectorSchema.parse).withOptions({
      shallow: false,
      startTransition
    })
  )
  return { timerSelector, setTimerSelector, loading: isTransitioning }
}
