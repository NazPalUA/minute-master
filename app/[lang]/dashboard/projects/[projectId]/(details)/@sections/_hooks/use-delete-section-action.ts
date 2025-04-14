'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { deleteSection } from '@/server/actions/delete-section'
import { GetSectionsDetailsReturn } from '@/server/data/get-sections-details'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'

export function useDeleteSectionAction(
  sections: GetSectionsDetailsReturn['data']
) {
  const { section: sectionDict } = useDictionary()

  return useOptimisticAction(deleteSection, {
    currentState: sections,
    updateFn: (state, input) => {
      return state.filter(section => section.id !== input.sectionId)
    },
    // onSuccess: () => {
    //   toast.success(sectionDict.actions.delete.success)
    // },
    onError: () => {
      toast.error(sectionDict.actions.delete.failure)
    }
    // onSettled: () => {
    //   router.refresh()
    // }
  })
}
