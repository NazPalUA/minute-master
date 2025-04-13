import { getProjectInfo } from '@/server/data/get-project-info'

export async function getTimelineData(projectId: string) {
  const projectInfo = await getProjectInfo({ projectId })
  const { startDate, dueDate } = projectInfo

  // Handle missing dates
  if (!startDate && !dueDate) {
    return {
      value: 0,
      leftLabel: 'No start date',
      rightLabel: 'No due date',
      message: 'Missing timeline information'
    }
  }

  if (!startDate) {
    return {
      value: 0,
      leftLabel: 'No start date',
      rightLabel: dueDate ? new Date(dueDate).toLocaleDateString() : 'N/A',
      message: 'Missing start date'
    }
  }

  if (!dueDate) {
    return {
      value: 0,
      leftLabel: new Date(startDate).toLocaleDateString(),
      rightLabel: 'No due date',
      message: 'Missing due date'
    }
  }

  // Both dates are available
  const now = new Date().getTime()
  const start = new Date(startDate).getTime()
  const end = new Date(dueDate).getTime()

  // Calculate percentage of time elapsed
  const timelinePercentage = ((now - start) / (end - start)) * 100
  // Cap at 100%
  const cappedPercentage = Math.min(100, Math.max(0, timelinePercentage))

  // Add message if project is overdue
  const message = timelinePercentage > 100 ? 'Project is overdue' : undefined

  return {
    value: cappedPercentage,
    leftLabel: new Date(startDate).toLocaleDateString(),
    rightLabel: new Date(dueDate).toLocaleDateString(),
    message
  }
}
