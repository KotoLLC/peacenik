import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const messageHubs = createSelector(selector, data => data.messageHubs)
const isHubCreatedSuccessfully = deepEqualSelector(messageHubs, data => data.isHubCreatedSuccessfully)
const hubsList = deepEqualSelector(messageHubs, data => data.hubsList)

export default {
    isHubCreatedSuccessfully,
    hubsList,
}