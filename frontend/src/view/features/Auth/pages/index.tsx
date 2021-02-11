import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthLayout } from './../layouts/AuthLayout'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'
import ResendEmailPage from './ResendEmailPage'

const AuthPages = () => (
  <Switch>
    <Route path="/resend-confirm-email" exact component={ResendEmailPage} />
    <AuthLayout>
      <Route path="/login" exact component={LoginPage} />
      <Route path="/registration" exact component={RegistrationPage} />
    </AuthLayout>
  </Switch>
)

export default AuthPages