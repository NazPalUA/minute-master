import { getProjectsNames } from '@/server/data/get-projects-names'

export async function GET() {
  const projects = await getProjectsNames()

  return Response.json(projects)
}
