'use client'

import { useQueryPagination } from '@/hooks/use-query-pagination'
import {
  createContext,
  ReactNode,
  TransitionStartFunction,
  useTransition
} from 'react'

type LogsTable = {
  queryPagination: ReturnType<typeof useQueryPagination>
  sectionFilter: {
    isPending: boolean
    startTransition: TransitionStartFunction
  }
  taskFilter: {
    isPending: boolean
    startTransition: TransitionStartFunction
  }
  isPending: boolean
}

export const LogsTableContext = createContext<LogsTable>({} as LogsTable)

export function LogsTableProvider({ children }: { children: ReactNode }) {
  const queryPagination = useQueryPagination({
    defaultPageIndex: 0,
    defaultPageSize: 10,
    shallow: false
  })

  const [isSectionPending, startSectionTransition] = useTransition()
  const [isTaskPending, startTaskTransition] = useTransition()

  const isPending =
    isTaskPending || isSectionPending || queryPagination.isPending

  return (
    <LogsTableContext.Provider
      value={{
        queryPagination,
        sectionFilter: {
          isPending: isSectionPending,
          startTransition: startSectionTransition
        },
        taskFilter: {
          isPending: isTaskPending,
          startTransition: startTaskTransition
        },
        isPending
      }}
    >
      {children}
    </LogsTableContext.Provider>
  )
}
