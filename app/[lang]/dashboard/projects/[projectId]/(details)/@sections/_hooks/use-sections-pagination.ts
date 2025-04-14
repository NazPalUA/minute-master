'use client'

import { usePagination } from '@/hooks'
import { GetSectionsDetailsReturn } from '@/server/data/get-sections-details'

type Props = {
  sections: GetSectionsDetailsReturn['data']
}

export function useSectionsPagination({ sections }: Props) {
  const pagination = usePagination({
    totalItems: sections.length,
    key: 'sec-list'
  })

  return {
    ...pagination,
    paginatedSections: pagination.paginatedItems(sections)
  }
}
