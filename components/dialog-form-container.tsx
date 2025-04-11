'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useDictionary } from '@/hooks'

type Props = {
  children: React.ReactNode
  trigger: React.ReactNode
  open: boolean
  setOpen(state: boolean): void
  entity: 'project' | 'task' | 'section' | 'time-log'
  variant?: 'create' | 'update'
}

export function DialogFormContainer({
  children,
  trigger,
  open,
  setOpen,
  entity,
  variant = 'create'
}: Props) {
  const {
    [entity]: {
      actions: { [variant]: dict }
    }
  } = useDictionary()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full sm:max-w-[425px] md:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{dict.title}</DialogTitle>
          <DialogDescription>{dict.description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
