'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks/use-dictionary'
import { TrashIcon } from 'lucide-react'

type Props = {
  onConfirmAction: () => void
  children?: React.ReactNode
  entity: 'time-log' | 'task' | 'section' | 'project'
}

export function AlertDialogDeleteEntity({
  onConfirmAction,
  entity,
  children
}: Props) {
  const { [entity]: entityDict, common: commonDict } = useDictionary()

  return (
    <AlertDialog>
      {children || (
        <AlertDialogTrigger asChild>
          <Button variant="secondary" size="icon">
            <TrashIcon className="size-4" />
            <span className="sr-only">{entityDict.actions.delete.trigger}</span>
          </Button>
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{entityDict.actions.delete.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {entityDict.actions.delete.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{commonDict.actions.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmAction}>
            {commonDict.actions.continue}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
