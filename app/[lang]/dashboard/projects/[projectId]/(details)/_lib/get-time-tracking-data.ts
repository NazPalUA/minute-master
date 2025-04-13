import { countTotalRuntime } from '@/server/data/count-total-runtime'
import { getProjectInfo } from '@/server/data/get-project-info'

export async function getTimeTrackingData(projectId: string) {
  const projectInfo = await getProjectInfo({ projectId })
  const estimatedTime = projectInfo.estimatedTime || 0
  const { total: actualTime } = await countTotalRuntime({ projectId })

  // Don't show progress if there's no estimated time or no actual time tracked
  if (estimatedTime <= 0 && actualTime <= 0) {
    return {
      value: 0,
      leftLabel: '0h',
      rightLabel: 'No estimate',
      message: 'No time data available'
    }
  }

  if (estimatedTime <= 0) {
    return {
      value: 0,
      leftLabel:
        actualTime > 0 ? `${Math.round(actualTime / (1000 * 60 * 60))}h` : '0h',
      rightLabel: 'No estimate',
      message: 'Missing time estimate'
    }
  }

  if (actualTime <= 0) {
    return {
      value: 0,
      leftLabel: '0h',
      rightLabel: `${Math.round(estimatedTime / (1000 * 60 * 60))}h`,
      message: 'No time tracked yet'
    }
  }

  const timeTrackingPercentage = (actualTime / estimatedTime) * 100

  // Add message if time tracking exceeds estimate
  const message =
    timeTrackingPercentage > 100 ? 'Exceeds estimated time' : undefined

  return {
    value: timeTrackingPercentage,
    leftLabel: `${Math.round(actualTime / (1000 * 60 * 60))}h`,
    rightLabel: `${Math.round(estimatedTime / (1000 * 60 * 60))}h`,
    message
  }
}
