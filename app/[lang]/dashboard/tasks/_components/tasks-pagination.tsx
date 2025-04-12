'use client'

import { Pagination } from '@/components/pagination/pagination'
import { use } from 'react'
import { TasksTableContext } from '../_lib/tasks-table-context'

type Props = { totalItems: number; totalPages: number }

export function TasksPagination({ totalItems, totalPages }: Props) {
  const { queryPagination } = use(TasksTableContext)

  return (
    <Pagination
      totalRowsCount={totalItems}
      pageCount={totalPages}
      shallow={false}
      queryPagination={queryPagination}
    />
  )
}
