import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state                     = createSelector(selector, data => data.messages)

const currentHub                = createSelector(state, data => data.currentHub)
const isCurrentHubRequested     = createSelector(state, data => data.isCurrentHubRequested)
const isMoreMessagesRequested   = createSelector(state, data => data.isMoreMessagesRequested)
const isMessagesRequested       = createSelector(state, data => data.isMessagesRequested)
const isSendMessageSuccess      = createSelector(state, data => data.isSendMessageSuccess)
const directMsgRoomFriends      = createSelector(state, data => data.directMsgRoomFriends)

const friend_id                 = deepEqualSelector(state, data => data.friend_id)
const messages                  = deepEqualSelector(state, data => data.messages)
const usersWithMessages         = deepEqualSelector(state, data => data.usersWithMessages)
const hubsWithMessages          = deepEqualSelector(state, data => data.hubsWithMessages)
const messageById               = deepEqualSelector(state, data => data.messageById)

export default {
  currentHub,
  isCurrentHubRequested,
  isSendMessageSuccess,
  messages,
  hubsWithMessages,
  isMoreMessagesRequested,
  isMessagesRequested,
  messageById,
  directMsgRoomFriends
}