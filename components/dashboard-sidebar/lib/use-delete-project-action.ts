'use client'

import { useDictionary } from '@/hooks/use-dictionary'
import { ROUTES } from '@/lib/constants'
import { deleteProject } from '@/server/actions/delete-project'
import { GetProjectsNamesReturn } from '@/server/data/get-projects-names'
import { useOptimisticAction } from 'next-safe-action/hooks'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useDeleteProjectAction(
  projects: GetProjectsNamesReturn['data']
) {
  const { project: projectDict, lang } = useDictionary()
  const router = useRouter()
  const params = useParams<{ projectId?: string }>()
  const currentProjectId = params.projectId

  return useOptimisticAction(deleteProject, {
    currentState: projects,
    updateFn: (state, input) => {
      return state.filter(project => project.id !== input.projectId)
    },
    onSuccess: ({ input: { projectId } }) => {
      // toast.success(projectDict.actions.delete.success)

      if (projectId === currentProjectId)
        router.push(ROUTES.DASHBOARD.PROJECTS.INDEX(lang))
    },
    onError: () => {
      toast.error(projectDict.actions.delete.failure)
    }
    // onSettled: () => {
    //   router.refresh()
    // }
  })
}
