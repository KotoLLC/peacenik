import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { AuthLayout } from './../layouts/AuthLayout'
import LoginPage from './LoginPage'


const AuthPages = () => (
  <Switch>
    <AuthLayout>
      <Route path="/login2" exact component={LoginPage} />
    </AuthLayout>
  </Switch>
)

export default AuthPages