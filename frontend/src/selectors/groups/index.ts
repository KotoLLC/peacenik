import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const self = createSelector(selector, data => data.groups)
const isGroupAddedSuccessfully = createSelector(self, data => data.isGroupAddedSuccessfully)
const isGroupEditedSuccessfully = createSelector(self, data => data.isGroupEditedSuccessfully)
const isGroupDeletedSuccessfully = createSelector(self, data => data.isGroupDeletedSuccessfully)
const isMemberDeletedSuccessfully = createSelector(self, data => data.isMemberDeletedSuccessfully)
const joinToGroupRequestSuccessfully = createSelector(self, data => data.joinToGroupRequestSuccessfully)
const isGroupLeavedSuccess = createSelector(self, data => data.isGroupLeavedSuccess)
const publicGroups = deepEqualSelector(self, data => data.publicGroups)
const myGroups = deepEqualSelector(self, data => data.myGroups)
const groupDetails = deepEqualSelector(self, data => data.groupDetails)
const invitesToConfirm = deepEqualSelector(self, data => data.invitesToConfirm)
const currentGroupId = deepEqualSelector(self, data => data.currentGroupId)
const coverUploadLink = deepEqualSelector(self, data => data.coverUploadLink)
const avatarUploadLink = deepEqualSelector(self, data => data.avatarUploadLink)
const groupMessages = deepEqualSelector(self, data => data.groupMessages)
const groupMessageToken = deepEqualSelector(self, data => data.groupMessageToken)

export default {
  isGroupAddedSuccessfully,
  isGroupEditedSuccessfully,
  isGroupDeletedSuccessfully,
  isMemberDeletedSuccessfully,
  joinToGroupRequestSuccessfully,
  isGroupLeavedSuccess,
  publicGroups,
  myGroups,
  groupDetails,
  invitesToConfirm,
  currentGroupId,
  coverUploadLink,
  avatarUploadLink,
  groupMessages,
  groupMessageToken,
}