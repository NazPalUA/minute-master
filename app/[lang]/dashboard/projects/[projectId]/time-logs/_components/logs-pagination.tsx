'use client'

import { Pagination } from '@/components/pagination/pagination'
import { use } from 'react'
import { LogsTableContext } from '../_lib/logs-table-context'

type Props = { totalItems: number; totalPages: number }

export function LogsPagination({ totalItems, totalPages }: Props) {
  const { queryPagination } = use(LogsTableContext)

  return (
    <Pagination
      totalRowsCount={totalItems}
      pageCount={totalPages}
      shallow={false}
      queryPagination={queryPagination}
    />
  )
}
