import type { CommonDict } from './dictionaries/common/dict-type'
import type { DashboardDict } from './dictionaries/dashboard/dict-type'
import type { ProjectDict } from './dictionaries/project/dict-type'
import type { PublicDict } from './dictionaries/public/dict-type'
import type { SectionDict } from './dictionaries/section/dict-type'
import type { TaskDict } from './dictionaries/task/dict-type'
import type { TimeLogDict } from './dictionaries/time-log/dict-type'
import type { TimeDict } from './dictionaries/time/dict-type'

export type Dictionary = {
  common: CommonDict
  dashboard: DashboardDict
  project: ProjectDict
  public: PublicDict
  section: SectionDict
  task: TaskDict
  time: TimeDict
  timeLog: TimeLogDict
}
