'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { DialogFormContainer } from '../dialog-form-container'
import { DynamicSelect } from '../selectors'
import { TaskForm } from './task-form'

type Props = {
  children: React.ReactNode
  updateTask?: {
    projectId: string
    projectName: string
    sectionId: string
    sectionName: string
    taskId: string
    taskName: string
    taskDescription?: string
    dueDate?: Date
    estimatedTime?: number
  }
}

export function TaskDialog({ children, updateTask }: Props) {
  const params = useParams<{ projectId?: string }>()

  const variant = updateTask ? 'update' : 'create'

  const [open, setOpen] = useState(false)

  const [projectId, setProjectId] = useState<string | undefined>(
    params.projectId
  )
  const [sectionId, setSectionId] = useState<string | undefined>()

  return (
    <DialogFormContainer
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant={variant}
      entity="task"
    >
      <div className="space-y-4">
        {updateTask ? (
          <div className="text-muted-foreground text-xs">
            <span className="font-medium">{updateTask.projectName}</span>
            <span> &bull; {updateTask.sectionName}</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 sm:flex-row">
            <DynamicSelect
              value={projectId || ''}
              onValueChange={value => {
                setProjectId(value)
                setSectionId(undefined)
              }}
              url="/api/projects"
              dictKey="project"
            />

            <DynamicSelect
              value={sectionId || ''}
              onValueChange={setSectionId}
              url={projectId ? `/api/projects/${projectId}/sections` : null}
              disabled={!projectId}
              dictKey="section"
            />
          </div>
        )}

        <TaskForm
          closeDialog={() => setOpen(false)}
          projectId={projectId}
          sectionId={sectionId}
          task={
            updateTask
              ? {
                  id: updateTask.taskId,
                  name: updateTask.taskName,
                  description: updateTask.taskDescription,
                  projectId: updateTask.projectId,
                  dueDate: updateTask.dueDate,
                  estimatedTime: updateTask.estimatedTime
                }
              : undefined
          }
        />
      </div>
    </DialogFormContainer>
  )
}
