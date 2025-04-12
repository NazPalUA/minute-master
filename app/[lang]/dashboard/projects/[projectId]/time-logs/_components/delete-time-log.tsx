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

type Props = { onConfirmAction: () => void }

export function DeleteTimeLog({ onConfirmAction }: Props) {
  const { 'time-log': timeLogDict, common: commonDict } = useDictionary()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <TrashIcon className="size-4" />
          <span className="sr-only">{timeLogDict.actions.delete.trigger}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {timeLogDict.actions.delete.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {timeLogDict.actions.delete.description}
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
