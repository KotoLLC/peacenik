import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.messages)
const messageTokens = deepEqualSelector(state, data => data.messageTokens)
const currentHub = createSelector(state, data => data.currentHub)
const isMoreMessagesRequested = createSelector(state, data => data.isMoreMessagesRequested)
const isMessagesRequested = createSelector(state, data => data.isMessagesRequested)
const isMessagePostedSuccess = createSelector(state, data => data.isMessagePostedSuccess)
const messages = deepEqualSelector(state, data => data.messages)
const hubsWithMessages = deepEqualSelector(state, data => data.hubsWithMessages)
const currentMessageLikes = deepEqualSelector(state, data => data.currentMessageLikes)
const currentCommentLikes = deepEqualSelector(state, data => data.currentCommentLikes)
const messageById = deepEqualSelector(state, data => data.messageById)

export default {
  messageTokens,
  currentHub,
  isMessagePostedSuccess,
  messages,
  currentMessageLikes,
  currentCommentLikes,
  hubsWithMessages,
  isMoreMessagesRequested,
  isMessagesRequested,
  messageById,
}