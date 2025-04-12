'use client'

import { FormTextField } from '@/components/form-text-field'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { createTask } from '@/server/actions/create-task'
import { updateTask } from '@/server/actions/update-task'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DateTimeFormItem } from '../date-time-form-item'
import { formSchema, FormValues } from './lib/form-schema'

type Props = {
  closeDialog(): void
  projectId?: string
  sectionId?: string
  task?: {
    id: string
    name: string
    description?: string
    projectId: string
    dueDate?: Date
    estimatedTime?: number
  }
}

export function TaskForm({ closeDialog, projectId, sectionId, task }: Props) {
  const { common: commonDict, task: taskDict, time: timeDict } = useDictionary()

  const variant = task ? 'update' : 'create'

  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(commonDict.validation)),
    defaultValues: {
      name: task?.name,
      description: task?.description,
      dueDate: task?.dueDate,
      estimatedTime: task?.estimatedTime
    }
  })

  const {
    execute: createExecute,
    isPending: createIsPending,
    hasErrored: createHasErrored
  } = useAction(createTask, {
    onSuccess: () => {
      form.reset()
      toast.success(taskDict.actions.create.success)
      closeDialog()
      router.refresh()
    },
    onError: () => {
      toast.error(taskDict.actions.create.failure)
    }
  })

  const {
    execute: updateExecute,
    isPending: updateIsPending,
    hasErrored: updateHasErrored
  } = useAction(updateTask, {
    onSuccess: () => {
      form.reset()
      toast.success(taskDict.actions.update.success)
      closeDialog()
      router.refresh()
    },
    onError: () => {
      toast.error(taskDict.actions.update.failure)
    }
  })

  const isPending = variant === 'create' ? createIsPending : updateIsPending
  const hasErrored = variant === 'create' ? createHasErrored : updateHasErrored

  const onSubmit = (data: FormValues) => {
    if (projectId && sectionId && !task) {
      createExecute({
        projectId: projectId,
        sectionId: sectionId,
        name: data.name,
        description: data.description,
        dueDate: data.dueDate,
        estimatedTime: data.estimatedTime
      })
    } else if (task) {
      updateExecute({
        query: { taskId: task.id },
        payload: {
          name: data.name,
          description: data.description,
          dueDate: data.dueDate,
          estimatedTime: data.estimatedTime
        }
      })
    } else {
      toast.error(taskDict.actions.create.failure)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-x-6 gap-y-4 py-4 md:grid-cols-2">
          <FormTextField
            className="md:col-span-2"
            name="name"
            control={form.control}
            label={taskDict.fields.name.label}
            placeholder={taskDict.fields.name.placeholder}
          />

          <FormTextField
            name="estimatedTime"
            type="number"
            control={form.control}
            label={`${taskDict.fields.estimatedTime.label} (${timeDict.units.hour.shortPlural})`}
            placeholder={taskDict.fields.estimatedTime.placeholder}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <DateTimeFormItem
                granularity="minute"
                label={taskDict.fields.dueDate.label}
                value={field.value}
                onChange={field.onChange}
                placeholder={taskDict.fields.dueDate.placeholder}
              />
            )}
          />

          <FormTextField
            className="md:col-span-2"
            name="description"
            control={form.control}
            label={taskDict.fields.description.label}
            placeholder={taskDict.fields.description.placeholder}
            textarea
          />
        </div>

        <DialogFooter className="mt-4 flex items-center gap-2">
          {hasErrored && (
            <p className="text-destructive">
              {taskDict.actions.create.failure}
            </p>
          )}
          <Button
            type="submit"
            className="hover:bg-primary/90 h-10 w-full rounded-lg px-6 text-sm font-medium transition-all md:w-auto"
            disabled={
              isPending ||
              (!projectId && variant === 'create') ||
              (!sectionId && variant === 'create')
            }
          >
            {isPending
              ? commonDict.actions[variant]
              : commonDict.status.loading}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
