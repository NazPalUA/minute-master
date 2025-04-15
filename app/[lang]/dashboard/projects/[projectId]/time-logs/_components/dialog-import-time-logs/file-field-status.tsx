'use client'
'use no memo' // to fix the bug with react hook form "watch"

import { Button } from '@/components/ui/button'
import { useDictionary } from '@/hooks'
import {
  FILE_ERROR_TYPE,
  UseReadJsonFileResult
} from '@/hooks/use-read-json-file/types'
import { CheckCircle, Loader2, RefreshCw, X } from 'lucide-react'
import { ImportSchema } from './lib/import-schema'

type Props = {
  isReadingFile: boolean
  fileError: UseReadJsonFileResult<ImportSchema>['error']
  data: ImportSchema | null
  onCancel: () => void
  onRetry: () => void
}

export function FileFieldStatus({
  isReadingFile,
  fileError,
  data,
  onCancel,
  onRetry
}: Props) {
  const { common: commonDict, 'time-log': timeLogDict } = useDictionary()

  if (isReadingFile) {
    return (
      <div className="absolute right-14 flex items-center">
        <Loader2 className="text-muted-foreground mr-2 h-5 w-5 animate-spin" />
        <span className="text-muted-foreground text-sm">
          {commonDict.status.loading}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2 h-7 w-7"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  if (fileError?.type === FILE_ERROR_TYPE.ABORTED) {
    return (
      <div className="absolute right-14 flex items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex h-7 items-center px-2"
          onClick={onRetry}
        >
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          <span className="text-xs">{commonDict.actions.retry}</span>
        </Button>
      </div>
    )
  }

  if (data) {
    return (
      <div className="absolute right-14 flex items-center">
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        <span className="text-sm font-medium text-green-600">
          {data.length}{' '}
          {data.length === 1
            ? timeLogDict.entity.singular
            : timeLogDict.entity.plural}
        </span>
      </div>
    )
  }

  return null
}
