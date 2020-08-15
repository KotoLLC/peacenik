import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.notifications)
const notifications = deepEqualSelector(state, data => data.notifications)
const notificationLength = deepEqualSelector(state, data => data.notifications.length)
const lastKnownIdFromMessageHubs = deepEqualSelector(state, data => data.lastKnownIdFromMessageHubs)
const lastKnownIdFromUserHub = deepEqualSelector(state, data => data.lastKnownIdFromUserHub)

export default {
  notifications,
  notificationLength,
  lastKnownIdFromMessageHubs,
  lastKnownIdFromUserHub,
}