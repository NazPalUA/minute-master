import { getSectionsNames } from '@/server/data/get-sections-names'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params

  const sections = await getSectionsNames({
    projectId
  })

  return Response.json(sections)
}
