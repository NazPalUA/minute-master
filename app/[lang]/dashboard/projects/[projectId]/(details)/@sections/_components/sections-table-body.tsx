'use client'

import { AlertDialogDeleteEntity } from '@/components/alert-dialog-delete-entity'
import { SectionFormDialog } from '@/components/create-section-dialog'
import { Button } from '@/components/ui/button'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useDictionary } from '@/hooks'
import { formatDuration } from '@/lib/utils'
import { GetSectionsDetailsReturn } from '@/server/data/get-sections-details'
import { Pencil } from 'lucide-react'
import { useDeleteSectionAction } from '../_hooks/use-delete-section-action'
import { useSectionsPagination } from '../_hooks/use-sections-pagination'

export function SectionsTableBody({
  sections
}: {
  sections: GetSectionsDetailsReturn['data']
}) {
  const { time: timeDict } = useDictionary()

  const { execute: executeDelete, optimisticState: optimisticSections } =
    useDeleteSectionAction(sections)

  const { paginatedSections } = useSectionsPagination({
    sections: optimisticSections
  })

  return (
    <TableBody>
      {paginatedSections.map(section => (
        <TableRow key={section.id}>
          <TableCell className="font-medium">{section.name}</TableCell>
          <TableCell>{section.taskCount}</TableCell>
          <TableCell>
            {formatDuration(section.timeSpent ?? 0, {
              hrs: timeDict.units.hour.shortPlural,
              mins: timeDict.units.minute.shortPlural
            })}
          </TableCell>
          <TableCell className="flex items-center justify-end gap-2">
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
            <AlertDialogDeleteEntity
              onConfirmAction={() => executeDelete({ sectionId: section.id })}
              entity="section"
            />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
