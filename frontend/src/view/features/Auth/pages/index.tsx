import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthLayout } from './../layouts/AuthLayout'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'
import ResendEmailPage from './ResendEmailPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import ForgotUsernamePage from './ForgotUsernamePage'
import ResetPasswordPage from './ResetPasswordPage'
import ConfirmUserPage from './ConfirmUserPage'

const AuthPages = () => (
  <Switch>
    <Route path="/resend-confirm-email" exact component={ResendEmailPage} />
    <Route path="/confirm-user" exact component={ConfirmUserPage} />
    <AuthLayout>
      <Route exact path="/" component={LoginPage} />
      <Route path="/login" exact component={LoginPage} />
      <Route path="/registration" exact component={RegistrationPage} />
      <Route path="/forgot-username" exact component={ForgotUsernamePage} />
      <Route path="/forgot-password" exact component={ForgotPasswordPage} />
      <Route path="/reset-password" exact component={ResetPasswordPage} />
    </AuthLayout>
  </Switch>
)

export default AuthPages