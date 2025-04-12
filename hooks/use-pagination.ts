'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { useState, useTransition } from 'react'

type Props = {
  totalItems: number
  pageSize?: number
  storePageSizeInUrl?: boolean
  storePageInUrl?: boolean
  key?: string
  shallow?: boolean
}

type Return = {
  page: number
  setPage(page: number): void
  isPending: boolean
  pageSize: number
  setPageSize(size: number): void
  totalPages: number
  startIndex: number
  endIndex: number
  needPagination: boolean
  paginatedItems: <T>(items: T[]) => T[]
  openNextPage: () => void
  openPreviousPage: () => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalItems: number
}

export function usePagination({
  totalItems,
  pageSize: defaultPageSize = 5,
  key,
  shallow = true,
  storePageSizeInUrl = false,
  storePageInUrl = true
}: Props): Return {
  const [isPending, startTransition] = useTransition()

  const [localPageSize, setLocalPageSize] = useState(defaultPageSize)
  const [localPage, setLocalPage] = useState(1)

  const createIntegerParser = (defaultValue: number) =>
    parseAsInteger
      .withDefault(defaultValue)
      .withOptions({ startTransition, shallow })

  const [urlPage, setUrlPage] = useQueryState(
    key ? key + '-page' : 'page',
    createIntegerParser(1)
  )

  const [urlPageSize, setUrlPageSize] = useQueryState(
    key ? key + '-page-size' : 'page-size',
    createIntegerParser(defaultPageSize)
  )

  const pageSize = storePageSizeInUrl ? urlPageSize : localPageSize
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(
    Math.max(1, storePageInUrl ? urlPage : localPage),
    totalPages
  )
  const startIndex = totalItems > 0 ? (page - 1) * pageSize : 0
  const endIndex =
    totalItems > 0 ? Math.min(startIndex + pageSize - 1, totalItems - 1) : 0
  const needPagination = totalItems > pageSize && totalPages > 1

  const setPageSize = (size: number) => {
    if (storePageSizeInUrl) setUrlPageSize(size)
    else setLocalPageSize(size)
  }

  const paginatedItems = <T>(items: T[]): T[] => {
    if (items.length === 0) return []
    return items.slice(startIndex, endIndex + 1)
  }

  const setPage = (newPage: number) => {
    const boundedPage = Math.min(Math.max(1, newPage), totalPages)
    if (storePageInUrl) setUrlPage(boundedPage)
    else setLocalPage(boundedPage)
  }

  return {
    page,
    setPage,
    isPending,
    pageSize,
    setPageSize,
    totalPages,
    startIndex,
    endIndex,
    needPagination,
    paginatedItems,
    openNextPage: () => setPage(page + 1),
    openPreviousPage: () => setPage(page - 1),
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    totalItems
  }
}
