import { createSelector } from 'reselect'
import { selector } from '../common'

const profile = createSelector(selector, data => data.profile)
const isAdmin = createSelector(profile, data => data.is_admin)
const userName = createSelector(profile, data => data.name)
const userEmail = createSelector(profile, data => data.email)
const userId = createSelector(profile, data => data.id)

export default {
    profile,
    isAdmin,
    userId,
    userName,
    userEmail,
}