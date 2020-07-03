import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const state = createSelector(selector, data => data.friends)
const friends = deepEqualSelector(state, data => data.friends)
const friendsOfFriends = deepEqualSelector(state, data => data.friendsOfFriends)
const invitations = deepEqualSelector(state, data => data.invitations)

export default {
    friends,
    friendsOfFriends,
    invitations,
}