import { countTasks } from '@/server/data/count-tasks'

export async function getTaskCompletionData(projectId: string) {
  const taskData = await countTasks({ projectId })

  // Don't show progress if there are no tasks
  if (taskData.total === 0) {
    return {
      value: 0,
      leftLabel: '0 / 0',
      rightLabel: '0%',
      message: 'No tasks created yet'
    }
  }

  const taskCompletionPercentage = (taskData.completed / taskData.total) * 100

  return {
    value: taskCompletionPercentage,
    leftLabel: `${taskData.completed} / ${taskData.total}`,
    rightLabel: `${Math.round(taskCompletionPercentage)}%`
  }
}
