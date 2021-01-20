import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const self = createSelector(selector, data => data.groups)
const isGroupAddedSuccessfully = createSelector(self, data => data.isGroupAddedSuccessfully)
const isGroupEditedSuccessfully = createSelector(self, data => data.isGroupEditedSuccessfully)
const isGroupDeletedSuccessfully = createSelector(self, data => data.isGroupDeletedSuccessfully)
const joinToGroupRequestSuccessfully = createSelector(self, data => data.joinToGroupRequestSuccessfully)
const publicGroups = deepEqualSelector(self, data => data.publicGroups)
const myGroups = deepEqualSelector(self, data => data.myGroups)
const groupDetails = deepEqualSelector(self, data => data.groupDetails)

export default {
  isGroupAddedSuccessfully,
  isGroupEditedSuccessfully,
  isGroupDeletedSuccessfully,
  joinToGroupRequestSuccessfully,
  publicGroups,
  myGroups,
  groupDetails,
}