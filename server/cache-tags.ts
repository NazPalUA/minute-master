import { ObjectId } from 'mongodb'

type ID = string | ObjectId

export class CacheTags {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  // User level tags
  user = () => `user:${this.userId}`

  // Project level tags with metadata distinction
  allProjects = () => `user:${this.userId}:project`
  allProjectsMeta = () => `user:${this.userId}:project:meta`
  project = (projectId: ID) => `user:${this.userId}:project:${projectId}`
  projectMeta = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:meta`

  // Section level tags with metadata distinction
  allSections = () => `user:${this.userId}:section`
  allSectionsMeta = () => `user:${this.userId}:section:meta`
  projectSections = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:section`
  projectSectionsMeta = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:section:meta`
  section = (sectionId: ID) => `user:${this.userId}:section:${sectionId}`
  sectionMeta = (sectionId: ID) =>
    `user:${this.userId}:section:${sectionId}:meta`

  // Task level tags with metadata distinction
  allTasks = () => `user:${this.userId}:task`
  allTasksMeta = () => `user:${this.userId}:task:meta`
  projectTasks = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:task`
  projectTasksMeta = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:task:meta`
  sectionTasks = (sectionId: ID) =>
    `user:${this.userId}:section:${sectionId}:task`
  sectionTasksMeta = (sectionId: ID) =>
    `user:${this.userId}:section:${sectionId}:task:meta`
  task = (taskId: ID) => `user:${this.userId}:task:${taskId}`
  taskMeta = (taskId: ID) => `user:${this.userId}:task:${taskId}:meta`

  // TimeLog level tags
  allTimeLogs = () => `user:${this.userId}:timelog`
  projectTimeLogs = (projectId: ID) =>
    `user:${this.userId}:project:${projectId}:timelog`
  sectionTimeLogs = (sectionId: ID) =>
    `user:${this.userId}:section:${sectionId}:timelog`
  taskTimeLogs = (taskId: ID) => `user:${this.userId}:task:${taskId}:timelog`
  timeLog = (timeLogId: ID) => `user:${this.userId}:timelog:${timeLogId}`
}
