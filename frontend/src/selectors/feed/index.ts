import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.feed)
const feedsTokens = deepEqualSelector(state, data => data.feedsTokens)
const currentHub = createSelector(state, data => data.currentHub)
const isCurrentHubRequested = createSelector(state, data => data.isCurrentHubRequested)
const isMoreMessagesRequested = createSelector(state, data => data.isMoreMessagesRequested)
const isMessagesRequested = createSelector(state, data => data.isMessagesRequested)
const isFeedMessagePostedSuccess = createSelector(state, data => data.isFeedMessagePostedSuccess)
const messages = deepEqualSelector(state, data => data.messages)
const groupMessages = deepEqualSelector(state, data => data.groupMessages)
const groupMessageToken = deepEqualSelector(state, data => data.groupMessageToken)
const hubsWithMessages = deepEqualSelector(state, data => data.hubsWithMessages)
const currentMessageLikes = deepEqualSelector(state, data => data.currentMessageLikes)
const currentCommentLikes = deepEqualSelector(state, data => data.currentCommentLikes)
const messageById = deepEqualSelector(state, data => data.messageById)

export default {
  feedsTokens,
  currentHub,
  isCurrentHubRequested,
  isFeedMessagePostedSuccess,
  messages,
  groupMessages,
  groupMessageToken,
  currentMessageLikes,
  currentCommentLikes,
  hubsWithMessages,
  isMoreMessagesRequested,
  isMessagesRequested,
  messageById,
}