import { createSelector } from 'reselect'
import { selector } from '../common'

const registration = createSelector(selector, data => data.registration)
const isRegisterSuccess = createSelector(registration, data => data.isRegisterSuccess)
const registrationErrorMessage = createSelector(registration, data => data.registrationErrorMessage)

export default {
  isRegisterSuccess,
  registrationErrorMessage,
}