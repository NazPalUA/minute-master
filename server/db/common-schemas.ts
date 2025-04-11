import { ObjectId } from 'mongodb'
import { z } from 'zod'

// MongoDB ObjectID with transform to ObjectId instance
export const ObjectIdSchema = z.union([
  z
    .string()
    .refine(val => ObjectId.isValid(val))
    .transform(id => new ObjectId(id))
    .describe('MongoDB ObjectID (string representation)'),
  z.instanceof(ObjectId).describe('MongoDB ObjectID instance')
])

// MongoDB ObjectID with transform to string
export const StringObjectIdSchema = z.union([
  z.string().refine(val => ObjectId.isValid(val)),
  z.instanceof(ObjectId).transform(id => id.toString())
])

// Clerk user ID with format validation
export const ClerkUserIdSchema = z
  .string()
  .min(1)
  .describe('Clerk user ID (format: user_xxxxxxxxxxxxxxxx)')

// Date handling system
export const DateLikeSchema = z
  .union([
    z.string().datetime({ offset: true }),
    z.number().int().min(0),
    z.date()
  ])
  .describe(
    'Acceptable date input (ISO 8601 string, Unix timestamp in ms, or Date object)'
  )

export const ClientProvidedDateSchema = DateLikeSchema.pipe(
  z.coerce.date()
).describe('Client-provided date (will be converted to Date instance)')

// Server-managed timestamps
export const UpdatedAtSchema = z
  .date()
  .describe('SERVER: Auto-updated on document modification')

export const CreatedAtSchema = z
  .date()
  .describe('SERVER: Auto-generated on document creation')
