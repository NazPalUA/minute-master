import { parseAsIndex, parseAsInteger, useQueryStates } from 'nuqs'
import { useTransition } from 'react'

const paginationUrlKeys = {
  page: 'page',
  pageSize: 'perPage'
}

export function useQueryPagination({
  shallow,
  defaultPageIndex,
  defaultPageSize
}: {
  shallow: boolean
  defaultPageIndex: number
  defaultPageSize: number
}) {
  const paginationParsers = {
    page: parseAsIndex.withDefault(defaultPageIndex),
    pageSize: parseAsInteger.withDefault(defaultPageSize)
  }

  const [isPending, startTransition] = useTransition()
  const [{ page, pageSize }, setPagination] = useQueryStates(
    paginationParsers,
    {
      urlKeys: paginationUrlKeys,
      shallow,
      startTransition
    }
  )

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const setPageSize = (pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize }))
  }

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    setPagination,
    isPending,
    startTransition
  }
}
