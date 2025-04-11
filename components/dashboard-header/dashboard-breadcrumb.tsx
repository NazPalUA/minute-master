import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants'
import type { Dictionary, Language } from '@/localization'
import { getProjectsNames } from '@/server/data/get-projects-names'
import { Slash } from 'lucide-react'
import { Suspense } from 'react'
import { BreadcrumbDirectory } from './breadcrumb-directory'
import { BreadcrumbProject } from './breadcrumb-project'

export function DashboardBreadcrumb({
  lang,
  dict
}: {
  lang: Language
  dict: Dictionary['dashboard']
}) {
  const projectNamesPromise = getProjectsNames()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={ROUTES.DASHBOARD.INDEX(lang)}>
            {dict.navigation.dashboard}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>

        <BreadcrumbDirectory />

        <Suspense
          fallback={
            <>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <Skeleton className="h-4 w-24" />
            </>
          }
        >
          <BreadcrumbProject projectNamesPromise={projectNamesPromise} />
        </Suspense>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
