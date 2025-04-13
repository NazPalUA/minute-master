'use client'

import { SectionFormDialog } from '@/components/create-section-dialog'
import { Button } from '@/components/ui/button'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { formatTimeDuration } from '@/lib/utils'
import { GetSectionsDetailsReturn } from '@/server/data/get-sections-details'
import { Pencil } from 'lucide-react'
import { useSectionsPagination } from '../hooks/use-sections-pagination'

export function SectionsTableBody({
  sections
}: {
  sections: GetSectionsDetailsReturn['data']
}) {
  const { time: timeDict } = useDictionary()

  const { paginatedSections } = useSectionsPagination({ sections })

  return (
    <TableBody>
      {paginatedSections.map(section => (
        <TableRow key={section.id}>
          <TableCell className="font-medium">{section.name}</TableCell>
          <TableCell>{section.taskCount}</TableCell>
          <TableCell>
            {formatTimeDuration(section.timeSpent ?? 0, {
              hrs: timeDict.units.hour.shortPlural,
              mins: timeDict.units.minute.shortPlural
            })}
          </TableCell>
          <TableCell className="text-right">
            <SectionFormDialog
              updateProps={{
                initialValues: {
                  name: section.name,
                  description: section.description
                },
                sectionId: section.id
              }}
            >
              <Button variant="ghost" size="sm">
                <Pencil className="h-4 w-4" />
              </Button>
            </SectionFormDialog>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
