import { ClientSession, TransactionOptions } from 'mongodb'
import { dbConnect } from './dbConnect'

export async function withTransaction<T>(
  operation: (session: ClientSession) => Promise<T>,
  options?: TransactionOptions
): Promise<T> {
  const { mongoClient } = await dbConnect()
  const session = mongoClient.startSession()

  try {
    let result: T
    await session.withTransaction(async () => {
      result = await operation(session)
    }, options)
    return result!
  } finally {
    await session.endSession()
  }
}

// Transaction Usage Example:
// import { withTransaction } from "@/server/db"

// const createProjectWithSections = actionClient.action(async () => {
//   return withTransaction(async (session) => {
//     const project = await db.projects.insertOne(
//       { name: "New Project" },
//       { session }
//     )

//     await db.sections.insertMany(
//       [{ projectId: project.insertedId }],
//       { session }
//     )

//     return project.insertedId
//   }, {
//     readPreference: 'primary',
//     readConcern: { level: 'local' },
//     writeConcern: { w: 'majority' }
//   })
// })
