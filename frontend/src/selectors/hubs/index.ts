import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const hubs = createSelector(selector, data => data.hubs)
const isHubCreatedSuccessfully = deepEqualSelector(hubs, data => data.isHubCreatedSuccessfully)
const hubsList = deepEqualSelector(hubs, data => data.hubsList)

export default {
    isHubCreatedSuccessfully,
    hubsList,
}