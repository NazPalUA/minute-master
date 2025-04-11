'use client'

import { parseAsBoolean, useQueryState } from 'nuqs'

export function useTimerDialogQueryState() {
  const [isOpen, setIsOpen] = useQueryState(
    'timer',
    parseAsBoolean.withDefault(false)
  )

  const openDialog = () => setIsOpen(true)

  const closeDialog = () => setIsOpen(false)

  const toggleDialog = () => setIsOpen(prev => !prev)

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog
  } as const
}
