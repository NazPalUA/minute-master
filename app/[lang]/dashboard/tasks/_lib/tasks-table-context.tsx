'use client'

import { useQueryPagination } from '@/hooks'
import { createContext, ReactNode } from 'react'

type TasksTable = {
  queryPagination: ReturnType<typeof useQueryPagination>
  isPending: boolean
}

export const TasksTableContext = createContext<TasksTable>({} as TasksTable)

export function TasksTableProvider({ children }: { children: ReactNode }) {
  const queryPagination = useQueryPagination({
    defaultPageIndex: 0,
    defaultPageSize: 10,
    shallow: false
  })

  const isPending = queryPagination.isPending

  return (
    <TasksTableContext.Provider
      value={{
        queryPagination,
        isPending
      }}
    >
      {children}
    </TasksTableContext.Provider>
  )
}
