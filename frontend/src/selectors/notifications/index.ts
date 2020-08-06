import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.notifications)
const notifications = deepEqualSelector(state, data => data.notifications)
const notificationLength = deepEqualSelector(state, data => data.notifications.length)
const lastKnownIdFromNodes = deepEqualSelector(state, data => data.lastKnownIdFromNodes)
const lastKnownIdFromCentral = deepEqualSelector(state, data => data.lastKnownIdFromCentral)

export default {
  notifications,
  notificationLength,
  lastKnownIdFromNodes,
  lastKnownIdFromCentral,
}