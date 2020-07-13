import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const messages = createSelector(selector, data => data.messages)
const messageTokens = createSelector(messages, data => data.messageTokens)
const currentNode = deepEqualSelector(messages, data => data.currentNode)

export default {
  messageTokens,
  currentNode,
}