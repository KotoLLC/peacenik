import { createSelector } from 'reselect'
import { selector } from '../common'

const authorization = createSelector(selector, data => data.authorization)
const isLogged = createSelector(authorization, data => data.isLogged)
const authToken = createSelector(authorization, data => data.authToken)
const loginErrorMessage = createSelector(authorization, data => data.loginErrorMessage)
const passwordErrorMessage = createSelector(authorization, data => data.passwordErrorMessage)
const isForgotPasswordSent = createSelector(authorization, data => data.isForgotPasswordSent)
const isForgotUserNameSent = createSelector(authorization, data => data.isForgotUserNameSent)
const isResetPasswordSuccess = createSelector(authorization, data => data.isResetPasswordSuccess)

export default {
  isLogged,
  authToken,
  loginErrorMessage,
  passwordErrorMessage,
  isForgotPasswordSent,
  isForgotUserNameSent,
  isResetPasswordSuccess,
}