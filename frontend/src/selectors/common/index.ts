import { createSelectorCreator, defaultMemoize, createSelector } from 'reselect'
import { StoreTypes } from './../../types'
import isEqual from 'lodash.isequal'

export const selector = createSelector((s: StoreTypes) => s, s => s)

export const deepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
)
