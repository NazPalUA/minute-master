'use client'

import { z } from 'zod'
import { useDictionary } from '../use-dictionary'
import { FILE_ERROR_TYPE, FileError } from './types'

export function useFileErrors() {
  const { common: dict } = useDictionary()

  const createValidationError = (err: z.ZodError): FileError => ({
    type: FILE_ERROR_TYPE.VALIDATION,
    message: dict.errors.validation,
    originalError: err
  })

  const createReadingError = (err: unknown): FileError => ({
    type: FILE_ERROR_TYPE.READING,
    message: dict.errors.fileReadFailed,
    originalError: err
  })

  const createParsingError = (err: unknown): FileError => ({
    type: FILE_ERROR_TYPE.PARSING,
    message: dict.errors.jsonParseError,
    originalError: err
  })

  const createFileSizeError = (maxFileSizeInBytes: number): FileError => ({
    type: FILE_ERROR_TYPE.FILE_SIZE,
    message: dict.validation.fileSize.replace(
      '{max}',
      `${(maxFileSizeInBytes / (1024 * 1024)).toFixed(2)}MB`
    )
  })

  const abortError: FileError = {
    type: FILE_ERROR_TYPE.ABORTED,
    message: dict.errors.fileReadAborted
  }

  const fileTypeError: FileError = {
    type: FILE_ERROR_TYPE.FILE_TYPE,
    message: dict.validation.fileType
  }

  return {
    createValidationError,
    createReadingError,
    createParsingError,
    createFileSizeError,
    abortError,
    fileTypeError
  }
}
