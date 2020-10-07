import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const dashboard = createSelector(selector, data => data.dashboard)
const objectionableContent = deepEqualSelector(dashboard, data => data.objectionableContent)

export default {
    objectionableContent
}