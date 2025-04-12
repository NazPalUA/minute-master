import { Skeleton } from '@/components/ui/skeleton'
import { GetProjectInfoReturn } from '@/server/data/get-project-info'

export async function ProjectInfo({
  projectInfoPromise
}: {
  projectInfoPromise: Promise<GetProjectInfoReturn>
}) {
  const { name, description } = await projectInfoPromise

  return (
    <div>
      <h1 className="mb-1 text-3xl font-bold tracking-tight">{name}</h1>
      <p className="text-muted-foreground text-md">{description}</p>
    </div>
  )
}

export function ProjectInfoSkeleton() {
  return (
    <div>
      <Skeleton className="mb-2 h-9 w-64" />
      <Skeleton className="h-5 w-96" />
    </div>
  )
}
