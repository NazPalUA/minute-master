'use client'
'use no memo' // to fix the bug with react hook form "watch"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useDictionary } from '@/hooks'
import { UseReadJsonFileResult } from '@/hooks/use-read-json-file/types'
import { FileUp } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { FileFieldStatus } from './file-field-status'
import { FormValues } from './lib/form-schema'
import { ImportSchema } from './lib/import-schema'

type FileFieldProps = {
  fileReader: UseReadJsonFileResult<ImportSchema>
}

export function FileField({ fileReader }: FileFieldProps) {
  const { common: commonDict } = useDictionary()
  const { setValue, watch, control } = useFormContext<FormValues>()
  const file = watch('file')

  const {
    readJsonFile,
    abort,
    data,
    isReading: isReadingFile,
    error: fileError
  } = fileReader

  const handleFileChange = async (file: File) => {
    setValue('file', file)
    await readJsonFile(file)
  }

  const handleCancel = () => abort()

  const handleRetry = () => {
    if (file) {
      readJsonFile(file)
    }
  }

  return (
    <FormField
      control={control}
      name="file"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{commonDict.actions.selectJSONFile}</FormLabel>
          <FormControl>
            <div className="relative flex items-center gap-3">
              <Input
                ref={field.ref}
                // {...field}
                type="file"
                accept=".json"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleFileChange(file)
                  }
                }}
                className="flex-1"
                disabled={isReadingFile}
              />

              <FileFieldStatus
                isReadingFile={isReadingFile}
                fileError={fileError}
                data={data}
                onCancel={handleCancel}
                onRetry={handleRetry}
              />

              <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                <FileUp className="text-muted-foreground h-5 w-5" />
              </div>
            </div>
          </FormControl>
          {fileError && <FormMessage>{fileError.message}</FormMessage>}
        </FormItem>
      )}
    />
  )
}
