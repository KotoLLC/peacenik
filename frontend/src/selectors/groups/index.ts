import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const self = createSelector(selector, data => data.groups)
const isGroupAddedSuccessfully = createSelector(self, data => data.isGroupAddedSuccessfully)
const isGroupEditedSuccessfully = createSelector(self, data => data.isGroupEditedSuccessfully)
const publicGroups = deepEqualSelector(self, data => data.publicGroups)
const myGroups = deepEqualSelector(self, data => data.myGroups)

export default {
  isGroupAddedSuccessfully,
  isGroupEditedSuccessfully,
  publicGroups,
  myGroups,
}