import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.messages)
const messageTokens = deepEqualSelector(state, data => data.messageTokens)
const currentNode = deepEqualSelector(state, data => data.currentNode)
const isMessagePostedSuccess = deepEqualSelector(state, data => data.isMessagePostedSuccess)
const messages = deepEqualSelector(state, data => data.messages)

export default {
  messageTokens,
  currentNode,
  isMessagePostedSuccess,
  messages,
}