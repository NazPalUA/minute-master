'use client'

import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import { GetSectionsDetailsReturn } from '@/server/data/get-sections-details'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { use } from 'react'
import { useSectionsPagination } from '../hooks/use-sections-pagination'

export function SectionsTablePagination({
  sectionsPromise
}: {
  sectionsPromise: Promise<GetSectionsDetailsReturn>
}) {
  const { data: sections } = use(sectionsPromise)
  const { common: commonDict } = useDictionary()

  const {
    isPending,
    startIndex,
    endIndex,
    needPagination,
    totalItems,
    hasNextPage,
    hasPreviousPage,
    openNextPage,
    openPreviousPage
  } = useSectionsPagination({ sections })

  if (!needPagination) return null

  return (
    <div className="mt-4 flex justify-between">
      <div className="text-muted-foreground text-sm">
        {commonDict.pagination.showing} {startIndex + 1}-{endIndex + 1}{' '}
        {commonDict.pagination.of} {totalItems} {commonDict.pagination.items}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage || isPending}
          onClick={openPreviousPage}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {commonDict.pagination.previous}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage || isPending}
          onClick={openNextPage}
        >
          {commonDict.pagination.next}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
