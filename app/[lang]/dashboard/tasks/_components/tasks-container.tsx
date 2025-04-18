'use client'

import { cn } from '@/lib/utils'
import { ReactNode, use } from 'react'
import { TasksTableContext } from '../_lib/tasks-table-context'

export function TasksContainer({ children }: { children: ReactNode }) {
  const { isPending } = use(TasksTableContext)

  return (
    <div className={cn('grid gap-6', { 'opacity-30': isPending })}>
      {children}
    </div>
  )
}
