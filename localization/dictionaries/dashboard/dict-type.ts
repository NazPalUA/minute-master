import en from './en.json'
import ru from './ru.json'
import uk from './uk.json'

import { DeepIntersection } from './../../utils'

export type DashboardDict = DeepIntersection<typeof en, typeof ru, typeof uk>
