import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const profile = createSelector(selector, data => data.profile)
const isAdmin = createSelector(profile, data => data.is_admin)
const ownedHubs = createSelector(profile, data => data.owned_hubs)
const user = createSelector(profile, data => data.user)
const userName = createSelector(user, data => data.name)
const userHideIdentity = deepEqualSelector(user, data => data.hide_identity)
const userFullName = createSelector(user, data => data.full_name)
const isEmailConfirmed = createSelector(user, data => data.is_confirmed)
const userEmail = createSelector(user, data => data.email)
const userId = createSelector(user, data => data.id)
const avatarUploadLink = deepEqualSelector(profile, data => data.avatarUploadLink)
const coverUploadLink = deepEqualSelector(profile, data => data.coverUploadLink)
const profileErrorMessage = deepEqualSelector(profile, data => data.profileErrorMessage)
const users = deepEqualSelector(profile, data => data.users)
const myGroups = deepEqualSelector(profile, data => data.groups)

export default {
    profile,
    isAdmin,
    isEmailConfirmed,
    userId,
    userName,
    userFullName,
    userEmail,
    userHideIdentity,
    avatarUploadLink,
    coverUploadLink,
    profileErrorMessage,
    ownedHubs,
    users,
    myGroups,
}