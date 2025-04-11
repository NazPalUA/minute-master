'use client'

import { DialogFormContainer } from '@/components/dialog-form-container'
import { FormTextField } from '@/components/form-text-field'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { ROUTES } from '@/lib/constants'
import { createProject } from '@/server/actions/create-project'
import { updateProject } from '@/server/actions/update-project'
import { GetProjectInfoReturn } from '@/server/data/get-project-info/schema-return'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DueDatePicker } from './due-date-picker'
import { formSchema, FormValues } from './lib/form-schema'

type Props = {
  children: React.ReactNode
  projectInfoPromise?: Promise<GetProjectInfoReturn>
}

export function ProjectDialog({ children, projectInfoPromise }: Props) {
  const {
    project: dict,
    time: timeDict,
    common: commonDict,
    lang
  } = useDictionary()

  const [open, setOpen] = useState(false)

  const projectInfo = projectInfoPromise ? use(projectInfoPromise) : undefined
  const variant = projectInfo ? 'update' : 'create'
  const formDict =
    variant === 'create' ? dict.actions.create : dict.actions.update

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(commonDict.validation)),
    defaultValues: {
      name: projectInfo?.name,
      description: projectInfo?.description,
      estimatedTime: projectInfo?.estimatedTime,
      dueDate: projectInfo?.dueDate ? new Date(projectInfo.dueDate) : undefined
    }
  })

  const router = useRouter()

  const {
    execute: createExecute,
    isPending: createIsPending,
    hasErrored: createHasErrored
  } = useAction(createProject, {
    onSuccess: ({ data }) => {
      form.reset()
      toast.success(formDict.success)
      setOpen(false)
      router.push(
        ROUTES.DASHBOARD.PROJECTS.DETAILS(lang, data?.projectId ?? '')
      )
    },
    onError: () => {
      toast.error(dict.actions.create.failure)
    }
  })

  const {
    execute: updateExecute,
    isPending: updateIsPending,
    hasErrored: updateHasErrored
  } = useAction(updateProject, {
    onSuccess: () => {
      form.reset()
      toast.success(formDict.success)
      setOpen(false)
    },
    onError: () => {
      toast.error(dict.actions.update.failure)
    }
  })

  const isPending = variant === 'create' ? createIsPending : updateIsPending
  const hasErrored = variant === 'create' ? createHasErrored : updateHasErrored

  const onSubmit = (data: FormValues) => {
    const estimatedTime = data.estimatedTime
      ? Math.round(data.estimatedTime * 60 * 60 * 1000)
      : undefined

    if (variant === 'create') {
      createExecute({
        ...data,
        estimatedTime: estimatedTime,
        sectionName: dict.actions.create.defaultSection.name,
        sectionDescription: dict.actions.create.defaultSection.description
      })
    } else if (projectInfo) {
      updateExecute({
        query: { projectId: projectInfo.id },
        payload: { ...data, estimatedTime: estimatedTime }
      })
    }
  }

  return (
    <DialogFormContainer
      entity="project"
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant={variant}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-x-6 gap-y-4 py-4 md:grid-cols-2">
            <FormTextField
              className="md:col-span-2"
              name="name"
              control={form.control}
              label={dict.fields.name.label}
              placeholder={dict.fields.name.placeholder}
            />

            <FormTextField
              name="estimatedTime"
              type="number"
              control={form.control}
              label={`${dict.fields.estimatedTime.label} (${timeDict.units.hour.plural})`}
              placeholder={dict.fields.estimatedTime.placeholder}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{timeDict.common.dueDate}</FormLabel>
                  <FormControl>
                    <DueDatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormTextField
              className="md:col-span-2"
              name="description"
              control={form.control}
              label={dict.fields.description.label}
              placeholder={dict.fields.description.placeholder}
              textarea
            />
          </div>

          <DialogFooter className="mt-4 flex items-center gap-2">
            {hasErrored && (
              <p className="text-destructive">{formDict.failure}</p>
            )}
            <Button
              type="submit"
              className="hover:bg-primary/90 h-10 w-full rounded-lg px-6 text-sm font-medium transition-all md:w-auto"
              disabled={isPending}
            >
              {isPending
                ? commonDict.status.loading
                : commonDict.actions.submit}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogFormContainer>
  )
}
