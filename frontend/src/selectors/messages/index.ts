import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.messages)
const messageTokens = deepEqualSelector(state, data => data.messageTokens)
const currentNode = createSelector(state, data => data.currentNode)
const isMoreMessagesRequested = createSelector(state, data => data.isMoreMessagesRequested)
const isMessagesRequested = createSelector(state, data => data.isMessagesRequested)
const isMessagePostedSuccess = createSelector(state, data => data.isMessagePostedSuccess)
const messages = deepEqualSelector(state, data => data.messages)
const nodesWithMessages = deepEqualSelector(state, data => data.nodesWithMessages)
const currentMessageLikes = deepEqualSelector(state, data => data.currentMessageLikes)
const currentCommentLikes = deepEqualSelector(state, data => data.currentCommentLikes)

export default {
  messageTokens,
  currentNode,
  isMessagePostedSuccess,
  messages,
  currentMessageLikes,
  currentCommentLikes,
  nodesWithMessages,
  isMoreMessagesRequested,
  isMessagesRequested,
}