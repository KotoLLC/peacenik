import { createSelector } from 'reselect'
import { selector } from '../common'

const messages = createSelector(selector, data => data.messages)
const messageTokens = createSelector(messages, data => data.messageTokens)

export default {
  messageTokens,
}