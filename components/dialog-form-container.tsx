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

type BaseProps = {
  children: React.ReactNode
  trigger: React.ReactNode
  open: boolean
  setOpen(state: boolean): void
}

type TimeLogProps = BaseProps & {
  entity: 'time-log'
  variant?: 'create' | 'update' | 'import'
}

type OtherEntityProps = BaseProps & {
  entity: 'project' | 'task' | 'section'
  variant?: 'create' | 'update'
}

type Props = TimeLogProps | OtherEntityProps

export function DialogFormContainer({
  children,
  trigger,
  open,
  setOpen,
  entity,
  variant = 'create'
}: Props) {
  const dictionary = useDictionary()
  const dict =
    entity === 'time-log' && variant === 'import'
      ? dictionary[entity].actions[variant]
      : dictionary[entity].actions[variant as 'create' | 'update']

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
