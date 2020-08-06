import React from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from '@view/pages/LoginPage'
import { FriendsPage } from '@view/pages/FriendsPage'
import { connect } from 'react-redux'
import { StoreTypes } from 'src/types'
import { NodePages } from './pages/NodePages'
import { MessagesPage } from './pages/MessagesPage'
import NotificationsPage from './pages/NotificationsPage'
import AboutUsPage from './pages/AboutUsPage'
import UserProfilePage from './pages/UserProfilePage'
import RegistrationPage from './pages/RegistrationPage'
import DocsPages from './pages/DocsPages'
import ConfirmUserPage from '@view/pages/ConfirmUserPage'
import selectors from '@selectors/index'

const Private = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (rest.isLogged) {
        return rest.isEmailConfirmed ? <Component {...props} /> : <Redirect to="/confirm-user" />
      }
      return <Redirect to="/login" />
    }} />
  )
}

const mapStateToProps = (state: StoreTypes) => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state),
})

const PrivateRoute = connect(mapStateToProps)(Private)

export const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/registration" component={RegistrationPage} />
        <Route path="/docs" component={DocsPages} />
        <Route path="/confirm-user" component={ConfirmUserPage} />
        <Route path="/about-us" component={AboutUsPage} />
        <PrivateRoute path="/friends" component={FriendsPage} />
        <PrivateRoute path="/nodes" component={NodePages} />
        <PrivateRoute path="/messages" component={MessagesPage} />
        <PrivateRoute path="/notifications" component={NotificationsPage} />
        <PrivateRoute path="/user-profile" component={UserProfilePage} />
        <Route component={() => <>404 not found</>} />
      </Switch>
    </Router>
  )
}

export const history = createBrowserHistory()