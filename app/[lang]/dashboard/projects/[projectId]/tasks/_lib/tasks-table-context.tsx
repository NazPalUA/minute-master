'use client'

import { useQueryPagination } from '@/hooks'
import {
  createContext,
  ReactNode,
  TransitionStartFunction,
  useTransition
} from 'react'

type TasksTable = {
  queryPagination: ReturnType<typeof useQueryPagination>
  statusFilter: {
    isPending: boolean
    startTransition: TransitionStartFunction
  }
  sectionFilter: {
    isPending: boolean
    startTransition: TransitionStartFunction
  }
  isPending: boolean
}

export const TasksTableContext = createContext<TasksTable>({} as TasksTable)

export function TasksTableProvider({ children }: { children: ReactNode }) {
  const queryPagination = useQueryPagination({
    defaultPageIndex: 0,
    defaultPageSize: 10,
    shallow: false
  })

  const [isStatusPending, startStatusTransition] = useTransition()
  const [isSectionPending, startSectionTransition] = useTransition()

  const isPending =
    isStatusPending || isSectionPending || queryPagination.isPending

  return (
    <TasksTableContext.Provider
      value={{
        queryPagination,
        statusFilter: {
          isPending: isStatusPending,
          startTransition: startStatusTransition
        },
        sectionFilter: {
          isPending: isSectionPending,
          startTransition: startSectionTransition
        },
        isPending
      }}
    >
      {children}
    </TasksTableContext.Provider>
  )
}
