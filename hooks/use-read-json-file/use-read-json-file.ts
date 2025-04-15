'use client'

import { asyncTryCatch, tryCatch } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'
import {
  DEFAULT_MAX_FILE_SIZE,
  UseReadJsonFileOptions,
  UseReadJsonFileResult
} from './types'
import { useFileErrors } from './use-file-errors'
import { isJsonFile, readFileAsText } from './utils'

export function useReadJsonFile<T>(
  schema: z.ZodType<T>,
  options: UseReadJsonFileOptions<T> = {}
): UseReadJsonFileResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [error, setError] = useState<UseReadJsonFileResult<T>['error']>(null)

  const maxFileSize = options.maxSizeInBytes ?? DEFAULT_MAX_FILE_SIZE
  const debounceMs = options.debounceMs ?? 300

  const timeoutRef = useRef<number | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    createValidationError,
    createReadingError,
    createParsingError,
    createFileSizeError,
    abortError,
    fileTypeError
  } = useFileErrors()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  function reset() {
    setData(null)
    setIsReading(false)
    setError(null)

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }

  function abort() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsReading(false)
      setError(abortError)
      options.onAbort?.()
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function validateFile(file: File) {
    if (!isJsonFile(file)) {
      setError(fileTypeError)
      options.onError?.(fileTypeError)
      setIsReading(false)
      return false
    }

    if (file.size > maxFileSize) {
      const fileError = createFileSizeError(maxFileSize)
      setError(fileError)
      options.onError?.(fileError)
      setIsReading(false)
      return false
    }

    return true
  }

  function validateContent(jsonData: unknown) {
    const result = schema.safeParse(jsonData)

    if (result.success) {
      setData(result.data)
      options.onSuccess?.(result.data)
      return true
    }

    const validationError = createValidationError(result.error)
    setError(validationError)
    options.onError?.(validationError)
    return false
  }

  async function readJsonFile(file: File): Promise<void> {
    // Clean up any existing operations
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    return new Promise<void>(resolve => {
      timeoutRef.current = window.setTimeout(async () => {
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        setIsReading(true)
        setError(null)
        setData(null)

        if (!validateFile(file)) {
          resolve()
          return
        }

        const [readError, text] = await asyncTryCatch(
          readFileAsText(file, signal)
        )

        if (signal.aborted) {
          resolve()
          return
        }

        if (readError) {
          const readingError = createReadingError(readError)
          setError(readingError)
          options.onError?.(readingError)
          setIsReading(false)
          resolve()
          return
        }

        const [parseError, parsedJSON] = tryCatch(() => JSON.parse(text))

        if (parseError) {
          const parsingError = createParsingError(parseError)
          setError(parsingError)
          options.onError?.(parsingError)
          setIsReading(false)
          resolve()
          return
        }

        validateContent(parsedJSON)
        setIsReading(false)
        abortControllerRef.current = null
        resolve()
      }, debounceMs)
    })
  }

  return {
    readJsonFile,
    reset,
    abort,
    data,
    isReading,
    error
  }
}
