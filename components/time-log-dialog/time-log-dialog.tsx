'use client'
'use no memo' // to fix the bug with react hook form "watch"

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { createTimeLog as createTimeLogAction } from '@/server/actions/create-time-log'
import { updateTimeLog as updateTimeLogAction } from '@/server/actions/update-time-log'
import { GetTimeLogsReturn } from '@/server/data/get-time-logs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DateTimeFormItem } from '../date-time-form-item'
import { DialogFormContainer } from '../dialog-form-container'
import { DynamicSelectFormItem } from '../selectors/dynamic-select-form-item'
import { formSchema, FormValues } from './lib/form-schema'

type Props = {
  children: React.ReactNode
  timeLog?: GetTimeLogsReturn['data'][number]
  project?: { id: string; name: string }
}

export function TimeLogDialog({ children, timeLog, project }: Props) {
  const { common: commonDict, 'time-log': timeLogDict } = useDictionary()
  const [open, setOpen] = useState(false)

  const variant = timeLog ? 'update' : 'create'

  const initialValues: Partial<FormValues> = {
    projectId: timeLog?.projectId || project?.id,
    sectionId: timeLog?.sectionId,
    taskId: timeLog?.taskId || undefined,
    startDate: timeLog?.start ? new Date(timeLog.start) : undefined,
    endDate: timeLog?.end ? new Date(timeLog.end) : undefined
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(commonDict.validation)),
    defaultValues: initialValues
  })

  const projectId = form.watch('projectId')
  const sectionId = form.watch('sectionId')

  const closeDialog = () => setOpen(false)

  const { execute: updateTimeLog, isPending: isUpdatingTimeLog } = useAction(
    updateTimeLogAction,
    {
      onSuccess: () => {
        toast.success(timeLogDict.actions.update.success)
        closeDialog()
      },
      onError: () => {
        toast.error(timeLogDict.actions.update.failure)
      }
    }
  )

  const { execute: createTimeLog, isPending: isCreatingTimeLog } = useAction(
    createTimeLogAction,
    {
      onSuccess: () => {
        toast.success(timeLogDict.actions.create.success)
        closeDialog()
      },
      onError: () => {
        toast.error(timeLogDict.actions.create.failure)
      }
    }
  )

  const isPending = isUpdatingTimeLog || isCreatingTimeLog

  const onSubmit = (data: FormValues) => {
    if (timeLog) {
      updateTimeLog({
        query: { timeLogId: timeLog.id },
        payload: data
      })
    } else {
      createTimeLog({
        projectId: data.projectId,
        sectionId: data.sectionId,
        taskId: data.taskId,
        startDate: data.startDate,
        endDate: data.endDate
      })
    }
  }

  return (
    <DialogFormContainer
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant={variant}
      entity="time-log"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="projectId"
            render={({ field }) => (
              <DynamicSelectFormItem
                onValueChange={value => {
                  form.resetField('sectionId', { defaultValue: undefined })
                  form.resetField('taskId', { defaultValue: undefined })
                  field.onChange(value)
                }}
                defaultValue={field.value}
                url="/api/projects"
                dictKey="project"
                initialOption={
                  timeLog
                    ? {
                        id: timeLog.projectId,
                        name: timeLog.projectName
                      }
                    : project
                      ? {
                          id: project.id,
                          name: project.name
                        }
                      : undefined
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => (
              <DynamicSelectFormItem
                key={projectId}
                onValueChange={value => {
                  form.resetField('taskId', { defaultValue: undefined })
                  field.onChange(value)
                }}
                defaultValue={field.value}
                url={projectId ? `/api/projects/${projectId}/sections` : null}
                disabled={!projectId}
                dictKey="section"
                initialOption={
                  timeLog
                    ? {
                        id: timeLog.sectionId,
                        name: timeLog.sectionName
                      }
                    : undefined
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="taskId"
            render={({ field }) => (
              <DynamicSelectFormItem
                key={sectionId}
                onValueChange={value => {
                  field.onChange(value)
                }}
                defaultValue={field.value || undefined}
                url={
                  sectionId && projectId
                    ? `/api/projects/${projectId}/sections/${sectionId}/tasks`
                    : null
                }
                dictKey="task"
                initialOption={
                  timeLog && timeLog.taskName && timeLog.taskId
                    ? { id: timeLog.taskId, name: timeLog.taskName }
                    : undefined
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <DateTimeFormItem
                className="flex-1 space-y-2"
                label={timeLogDict.fields.startDate.label}
                value={field.value}
                onChange={field.onChange}
                placeholder={timeLogDict.fields.startDate.placeholder}
              />
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <DateTimeFormItem
                className="flex-1 space-y-2"
                label={timeLogDict.fields.endDate.label}
                value={field.value || undefined}
                onChange={field.onChange}
                placeholder={timeLogDict.fields.endDate.placeholder}
              />
            )}
          />

          <DialogFooter className="mt-4 flex items-center gap-2">
            <Button
              type="submit"
              className="hover:bg-primary/90 h-10 w-full rounded-lg px-6 text-sm font-medium transition-all md:w-auto"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {commonDict.status.loading}
                </>
              ) : (
                timeLogDict.actions[variant].trigger
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogFormContainer>
  )
}
