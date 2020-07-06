import { createSelector } from 'reselect'
import { selector, deepEqualSelector } from '../common'

const nodes = createSelector(selector, data => data.nodes)
const isNodeCreatedSuccessfully = deepEqualSelector(nodes, data => data.isNodeCreatedSuccessfully)

export default {
    isNodeCreatedSuccessfully,
}