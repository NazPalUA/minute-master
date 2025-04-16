'use client'
'use no memo' // to fix the bug with react hook form "watch"

import { DialogFormContainer } from '@/components/dialog-form-container'
import { DynamicSelectFormItem } from '@/components/selectors/dynamic-select-form-item'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormField } from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { formSchema, FormValues } from './lib/form-schema'

type Props = {
  children: React.ReactNode
  project: { id: string; name: string }
}

export function DialogExportTimeLogs({ children, project }: Props) {
  const { common: commonDict, 'time-log': timeLogDict } = useDictionary()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(commonDict.validation)),
    defaultValues: {
      projectId: project.id,
      sectionId: undefined,
      taskId: undefined
    }
  })

  const projectId = form.watch('projectId')
  const sectionId = form.watch('sectionId')

  const closeDialog = () => setOpen(false)

  const triggerDownload = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'timelogs.json')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const buildExportUrl = (formData: FormValues): string => {
    const baseUrl = `/api/export/time-logs?projectId=${formData.projectId}`
    const sectionParam = formData.sectionId
      ? `&sectionId=${formData.sectionId}`
      : ''
    const taskParam = formData.taskId ? `&taskId=${formData.taskId}` : ''
    return `${baseUrl}${sectionParam}${taskParam}`
  }

  const onSubmit = async (formData: FormValues) => {
    setIsLoading(true)
    try {
      const url = buildExportUrl(formData)
      triggerDownload(url)
      closeDialog()
    } catch (error) {
      console.error('Error exporting time logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DialogFormContainer
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant="export"
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
                  project ? { id: project.id, name: project.name } : undefined
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
                onValueChange={field.onChange}
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

          <DialogFooter className="mt-4 flex items-center gap-2">
            <Button
              type="submit"
              className="hover:bg-primary/90 h-10 w-full rounded-lg px-6 text-sm font-medium transition-all md:w-auto"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {commonDict.status.loading}
                </>
              ) : (
                timeLogDict.actions.export.trigger
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogFormContainer>
  )
}
