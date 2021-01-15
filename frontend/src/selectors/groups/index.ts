import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const self = createSelector(selector, data => data.groups)
const isGroupAddedSuccessfully = createSelector(self, data => data.isGroupAddedSuccessfully)

export default {
  isGroupAddedSuccessfully,
}