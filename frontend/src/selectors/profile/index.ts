import { createSelector } from 'reselect'
import { selector } from '../common'

const profile = createSelector(selector, data => data.profile)
const isAdmin = createSelector(profile, data => data.is_admin)
const user = createSelector(profile, data => data.user)
const userId = createSelector(user, data => data.id)

export default {
    profile,
    isAdmin,
    userId,
}