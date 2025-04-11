'use client'

import { Select, SelectTrigger } from '@/components/ui/select'
import { useParams } from 'next/navigation'
import { use, useEffect } from 'react'
import { DynamicSelect, SelectorContainer } from '../selectors'
import { useTimerQueryState } from './lib/use-timer-query-state'
import { TimeCounterContext } from './time-counter-context'

export function TimerSelectors() {
  const params = useParams<{ projectId?: string }>()
  const { runningTimer, isPendingCreateTimeLog } = use(TimeCounterContext)

  const { timerSelector: state, setTimerSelector: setState } =
    useTimerQueryState()

  useEffect(() => {
    if (params.projectId && !state) {
      setState({ proj: params.projectId })
    }
  }, [params.projectId, state, setState])

  if (runningTimer)
    return (
      <RunningTimer
        project={runningTimer.project.name}
        section={runningTimer.section.name}
        task={runningTimer.task?.name}
      />
    )

  return (
    <div className="flex flex-col gap-2">
      <DynamicSelect
        value={state?.proj || ''}
        onValueChange={value => setState({ proj: value })}
        url="/api/projects"
        dictKey="project"
        disabled={isPendingCreateTimeLog}
      />

      {state?.proj && (
        <>
          <DynamicSelect
            value={state?.sec || ''}
            onValueChange={value => setState(prev => ({ ...prev, sec: value }))}
            url={`/api/projects/${state.proj}/sections`}
            dictKey="section"
            disabled={isPendingCreateTimeLog}
          />

          {state?.sec && (
            <DynamicSelect
              value={state?.task || ''}
              onValueChange={value =>
                setState(prev => ({ ...prev, task: value }))
              }
              url={`/api/projects/${state.proj}/sections/${state.sec}/tasks`}
              dictKey="task"
              disabled={isPendingCreateTimeLog}
            />
          )}
        </>
      )}
    </div>
  )
}

function RunningTimer(props: {
  project: string
  section: string
  task?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {[
        { label: 'Project', value: props.project },
        { label: 'Section', value: props.section },
        { label: 'Task', value: props.task || 'No Task' }
      ].map(({ label, value }) => (
        <SelectorContainer label={label} key={label}>
          <Select value={value} disabled>
            <SelectTrigger className="w-full">{value}</SelectTrigger>
          </Select>
        </SelectorContainer>
      ))}
    </div>
  )
}
