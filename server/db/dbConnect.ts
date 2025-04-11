import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { z } from 'zod'
import { createIndexes } from './createIndexes'

// Validate environment variables with Zod
const EnvSchema = z.object({
  ATLAS_URI: z.string().min(1),
  ATLAS_DATABASE: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

const env = EnvSchema.parse(process.env)

let mongoClient: MongoClient | null = null
let database: Db | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: Promise<MongoClient> | null
}

const clientOptions = {
  retryWrites: true,
  w: 'majority',
  serverSelectionTimeoutMS: 15000,
  maxPoolSize: 50,
  ignoreUndefined: true
} as const satisfies MongoClientOptions

export async function dbConnect() {
  if (mongoClient && database) {
    // Health check for existing connection
    try {
      await mongoClient.db().admin().ping()
      return { mongoClient, database }
    } catch {
      // Fall through to reconnect
    }
  }

  try {
    const clientPromise =
      global._mongoClient || MongoClient.connect(env.ATLAS_URI, clientOptions)

    if (env.NODE_ENV === 'development') {
      global._mongoClient = clientPromise
    }

    mongoClient = await clientPromise
    database = mongoClient.db(env.ATLAS_DATABASE)

    // Background index creation
    createIndexes(database).catch(console.error)

    return { mongoClient, database }
  } catch (error) {
    console.error('Database connection error:', error)
    throw new Error('Failed to connect to database', { cause: error })
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  if (mongoClient) {
    await mongoClient.close()
    console.log('MongoDB connection closed')
    process.exit(0)
  }
})
