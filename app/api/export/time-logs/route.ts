import { asyncTryCatch } from '@/lib/utils'
import { formatDuration } from '@/lib/utils/format-duration'
import { getTimeLogs } from '@/server/data/get-time-logs'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const projectId = searchParams.get('projectId')
  const sectionId = searchParams.get('sectionId')
  const taskId = searchParams.get('taskId')

  if (!projectId)
    return NextResponse.json(
      { error: 'Project ID is required' },
      { status: 400 }
    )

  const [error, timeLogs] = await asyncTryCatch(
    getTimeLogs({
      projectId,
      ...(sectionId ? { sectionId } : {}),
      ...(taskId ? { taskId } : {}),
      getAllItems: true
    })
  )

  if (error)
    return NextResponse.json(
      { error: 'Failed to fetch time logs' },
      { status: 500 }
    )

  const returnData = timeLogs.data.map(item => {
    const { hours, minutes, seconds } = formatDuration(item.duration)

    return {
      startTime: item.start,
      endTime: item.end,
      duration: `${hours}h ${minutes}m ${seconds}s`,
      sectionName: item.sectionName,
      projectName: item.projectName,
      taskName: item.taskName || null
    }
  })

  return new NextResponse(JSON.stringify(returnData, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="timelogs.json"'
    }
  })
}
