/**
 * Represents a successful operation result with a value and no error.
 * @template T The type of the successful result value.
 */
type Success<T> = [null, T]

/**
 * Represents a failed operation result with an error and no value.
 * @template E The type of the error.
 */
type Failure<E> = [E, null]

/**
 * Represents the result of an operation that can either succeed or fail.
 * @template T The type of the successful result value.
 * @template E The type of the error.
 */
type Result<T, E> = Success<T> | Failure<E>

/**
 * Formats an error into a consistent Error object
 * @template E The type of the error
 * @param {unknown} error The caught error
 * @returns {E} A formatted error
 */
function formatError<E = Error>(error: unknown): E {
  if (error instanceof Error) {
    return error as E
  } else if (typeof error === 'string') {
    return new Error(error) as E
  } else if (
    error !== null &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return new Error(error.message) as E
  } else {
    return new Error('Unknown error') as E
  }
}

/**
 * Safely executes a function and returns a tuple containing either an error or a result.
 * This utility helps avoid try-catch blocks in synchronous code by providing a structured result format.
 *
 * @template T The type of the successful result value.
 * @template E The type of the error (defaults to Error).
 * @param {() => T} fn The function to execute.
 * @returns {Result<T, E>} A tuple containing either [null, result] or [error, null].
 *
 * @example
 * // Basic usage
 * const [error, data] = tryCatch(() => processData(input));
 * if (error) {
 *   console.error(`Failed to process data: ${error.message}`);
 * } else {
 *   console.log(`Data processed: ${data}`);
 * }
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    const result = fn()
    return [null, result]
  } catch (error) {
    return [formatError<E>(error), null]
  }
}

/**
 * Safely executes a promise and returns a tuple containing either an error or a result.
 * This utility helps avoid try-catch blocks in async code by providing a structured result format.
 *
 * @template T The type of the successful result value.
 * @template E The type of the error (defaults to Error).
 * @param {Promise<T>} promise The promise to execute.
 * @returns {Promise<Result<T, E>>} A promise that resolves to a tuple containing either [null, result] or [error, null].
 *
 * @example
 * // Basic usage
 * const [error, data] = await asyncTryCatch(fetchData());
 * if (error) {
 *   console.error(`Failed to fetch data: ${error.message}`);
 * } else {
 *   console.log(`Data received: ${data}`);
 * }
 */
export async function asyncTryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const result = await promise
    return [null, result]
  } catch (error) {
    return [formatError<E>(error), null]
  }
}
