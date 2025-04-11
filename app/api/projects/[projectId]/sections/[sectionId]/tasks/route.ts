import { getTasksNames } from '@/server/data/get-tasks-names'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string; sectionId: string }> }
) {
  const { sectionId, projectId } = await params

  const tasks = await getTasksNames({ sectionId, projectId })

  return Response.json(tasks)
}
