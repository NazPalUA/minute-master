'use client'

import { FormTextField } from '@/components/form-text-field'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { useDictionary } from '@/hooks'
import { createSection } from '@/server/actions/create-section'
import { updateSection } from '@/server/actions/update-section'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { DialogFormContainer } from '../dialog-form-container'
import { defaultValues } from './lib/default-values'
import { formSchema, FormValues } from './lib/form-schema'

type UpdateProps = {
  initialValues: FormValues
  sectionId: string
}

type Props = {
  children: React.ReactNode
  updateProps?: UpdateProps
}

export function SectionFormDialog({ updateProps, children }: Props) {
  const dict = useDictionary()
  const [open, setOpen] = useState(false)

  const { projectId } = useParams()
  const router = useRouter()

  if (!projectId) throw new Error('Project ID is required')

  const variant = updateProps ? 'update' : 'create'
  const actionDict = dict.section.actions[variant]

  const closeDialog = () => setOpen(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(dict.common.validation)),
    defaultValues: updateProps ? updateProps.initialValues : defaultValues
  })

  const {
    execute: executeCreate,
    isPending: isCreatePending,
    hasErrored: hasCreateErrored
  } = useAction(createSection, {
    onSuccess: () => {
      form.reset()
      toast.success(actionDict.success)
      closeDialog()
      router.refresh()
    },
    onError: () => {
      toast.error(actionDict.failure)
    }
  })

  const {
    execute: executeUpdate,
    isPending: isUpdatePending,
    hasErrored: hasUpdateErrored
  } = useAction(updateSection, {
    onSuccess: () => {
      form.reset()
      toast.success(actionDict.success)
      closeDialog()
      router.refresh()
    },
    onError: () => {
      toast.error(actionDict.failure)
    }
  })

  const isPending = variant === 'create' ? isCreatePending : isUpdatePending
  const hasErrored = variant === 'create' ? hasCreateErrored : hasUpdateErrored

  const onSubmit = (data: FormValues) => {
    if (!updateProps) {
      executeCreate({
        ...data,
        projectId: projectId.toString()
      })
    } else {
      executeUpdate({
        query: {
          projectId: projectId.toString(),
          sectionId: updateProps.sectionId
        },
        payload: data
      })
    }
  }

  return (
    <DialogFormContainer
      open={open}
      setOpen={setOpen}
      trigger={children}
      variant={variant}
      entity="section"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <FormTextField
              name="name"
              control={form.control}
              label={dict.section.fields.name.label}
              placeholder={dict.section.fields.name.placeholder}
            />

            <FormTextField
              name="description"
              control={form.control}
              label={dict.section.fields.description.label}
              placeholder={dict.section.fields.description.placeholder}
              textarea
            />
          </div>

          <DialogFooter className="mt-4 flex items-center gap-2">
            {hasErrored && (
              <p className="text-destructive">{actionDict.failure}</p>
            )}
            <Button
              type="submit"
              className="hover:bg-primary/90 h-10 w-full rounded-lg px-6 text-sm font-medium transition-all md:w-auto"
              disabled={isPending}
            >
              {isPending
                ? dict.common.status.loading
                : dict.common.actions.submit}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogFormContainer>
  )
}
