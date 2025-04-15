export const FILE_ERROR_TYPE = {
  FILE_SIZE: 'FILE_SIZE',
  FILE_TYPE: 'FILE_TYPE',
  PARSING: 'PARSING',
  VALIDATION: 'VALIDATION',
  READING: 'READING',
  ABORTED: 'ABORTED'
} as const

export type FileError = {
  type: (typeof FILE_ERROR_TYPE)[keyof typeof FILE_ERROR_TYPE]
  message: string
  originalError?: unknown
}

export type UseReadJsonFileResult<T> = {
  readJsonFile: (file: File) => Promise<void>
  reset: () => void
  abort: () => void
  data: T | null
  isReading: boolean
  error: FileError | null
}

export type UseReadJsonFileOptions<T> = {
  onSuccess?: (data: T) => void
  onError?: (error: FileError) => void
  onAbort?: () => void
  maxSizeInBytes?: number
  debounceMs?: number
}

// Default max file size: 1MB
export const DEFAULT_MAX_FILE_SIZE = 1024 * 1024
