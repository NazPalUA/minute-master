'use client'

import { useQueryPagination } from '@/hooks'
import { PaginationUI } from './pagination-ui'

type PaginationUIProps = Parameters<typeof PaginationUI>[0]

type QueryPaginationReturn = ReturnType<typeof useQueryPagination>

type Props = {
  defaultPageSize?: number
  defaultPageIndex?: number
  shallow?: boolean
  queryPagination?: QueryPaginationReturn
} & Pick<
  PaginationUIProps,
  | 'selectedRowsCount'
  | 'alwaysShowSelectedRowsCount'
  | 'pageSizeOptions'
  | 'totalRowsCount'
  | 'pageCount'
>

export function Pagination({
  totalRowsCount,
  pageCount,
  selectedRowsCount,
  alwaysShowSelectedRowsCount = false,
  pageSizeOptions = [10, 20, 30, 40, 50],
  defaultPageSize = 10,
  defaultPageIndex = 0,
  shallow = true,
  queryPagination: queryPaginationProps
}: Props) {
  const queryPagination = useQueryPagination({
    defaultPageIndex,
    defaultPageSize,
    shallow
  })
  const { page, pageSize, setPage, setPageSize } =
    queryPaginationProps || queryPagination

  return (
    <PaginationUI
      selectedRowsCount={selectedRowsCount}
      totalRowsCount={totalRowsCount}
      alwaysShowSelectedRowsCount={alwaysShowSelectedRowsCount}
      pageSize={pageSize}
      pageSizeOptions={pageSizeOptions}
      pageIndex={page}
      pageCount={pageCount}
      onPageSizeChange={setPageSize}
      onGoToFirstPage={() => setPage(0)}
      onGoToPreviousPage={() => setPage(page - 1)}
      onGoToNextPage={() => setPage(page + 1)}
      onGoToLastPage={() => setPage(pageCount - 1)}
      canGoToPreviousPage={page > 0}
      canGoToNextPage={page < pageCount - 1}
    />
  )
}
