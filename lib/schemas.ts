import { z } from 'zod'

// Client-safe ObjectID validation (does not import mongodb)
export const ClientObjectIdStringSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId format' })
  .describe('Client-safe MongoDB ObjectID validation')

export const getPageSchema = ({
  min = 1,
  def = 1
}: {
  min?: number
  def?: number
} = {}) => z.coerce.number().int().min(min).default(def).catch(def)

export const getPageSizeSchema = ({
  min = 1,
  max = 100,
  def = 10
}: {
  min?: number
  max?: number
  def?: number
} = {}) => z.coerce.number().int().min(min).max(max).default(def).catch(def)
