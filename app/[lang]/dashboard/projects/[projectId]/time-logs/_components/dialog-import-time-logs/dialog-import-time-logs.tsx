'use client'
'use no memo' // to fix the bug with react hook form "watch"

import { DialogFormContainer } from '@/components/dialog-form-container'
import { DynamicSelectFormItem } from '@/components/selectors/dynamic-select-form-item'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { useDictionary, useReadJsonFile } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FileField } from './file-field'
import { formSchema, FormValues } from './lib/form-schema'
import { importSchema } from './lib/import-schema'
import { useActionCreateManyTimeLogs } from './lib/use-action-create-many-time-logs'

type Props = {
  children: React.ReactNode
  project: { id: string; name: string }
}

export function DialogImportTimeLogs({ children, project }: Props) {
  const { common: commonDict, 'time-log': timeLogDict } = useDictionary()
  const [open, setOpen] = useState(false)

  const fileReader = useReadJsonFile(importSchema(commonDict.validation), {
    onError: fileError => {
      toast.error(fileError.message)
    }
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(commonDict.validation)),
    defaultValues: {
      projectId: project.id,
      sectionId: undefined,
      taskId: undefined,
      file: undefined
    }
  })

  const projectId = form.watch('projectId')
  const sectionId = form.watch('sectionId')

  const closeDialog = () => setOpen(false)

  const { execute: createManyTimeLogs, isPending } =
    useActionCreateManyTimeLogs({
      closeDialog,
      resetForm: form.reset
    })

  const onSubmit = async (formData: FormValues) => {
    if (!fileReader.data) {
      toast.error(commonDict.validation.required)
      return
    }

    createManyTimeLogs({
      projectId: formData.projectId,
      sectionId: formData.sectionId,
      taskId: formData.taskId,
      timeLogs: fileReader.data
    })
  }

  return (
    <DialogFormContainer
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant="import"
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
                  project
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
                initialOption={undefined}
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
                initialOption={undefined}
              />
            )}
          />

          <FileField fileReader={fileReader} />

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
                timeLogDict.actions.create.trigger
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogFormContainer>
  )
}
