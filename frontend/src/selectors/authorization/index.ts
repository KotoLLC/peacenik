import { createSelector } from 'reselect'
import { selector } from '../common'

const authorization = createSelector(selector, data => data.authorization)
const isLogged = createSelector(authorization, data => data.isLogged)
const authToken = createSelector(authorization, data => data.authToken)
const loginErrorMessage = createSelector(authorization, data => data.loginErrorMessage)

export default {
  isLogged,
  authToken,
  loginErrorMessage,
}