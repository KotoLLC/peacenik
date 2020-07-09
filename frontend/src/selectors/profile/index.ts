import { createSelector } from 'reselect'
import { selector } from '../common'

const profile = createSelector(selector, data => data.profile)
const isAdmin = createSelector(profile, data => data.is_admin)

export default {
    profile,
    isAdmin,
}