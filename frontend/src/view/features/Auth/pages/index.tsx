import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthLayout } from './../layouts/AuthLayout'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'

const AuthPages = () => (
  <Switch>
    <AuthLayout>
      <Route path="/login2" exact component={LoginPage} />
      <Route path="/registration2" exact component={RegistrationPage} />
    </AuthLayout>
  </Switch>
)

export default AuthPages