import React from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from '@view/pages/LoginPage'
import { FriendsPage } from '@view/pages/FriendsPage'
import { connect } from 'react-redux'
import { StoreTypes } from './../types'
import { NodePages } from './pages/NodePages'
import { MessagesPage } from './pages/MessagesPage'
import { NotificationsPage } from './pages/NotificationsPage'
import DocsPages from './pages/DocsPages'

const Private = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      rest.isLogged ? <Component {...props} /> : <Redirect to="/login" />
    )} />
  )
}

const mapStateToProps = (state: StoreTypes) => ({
  isLogged: state.authorization.isLogged,
})

const PrivateRoute = connect(mapStateToProps)(Private)

export const Routes = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/docs" component={DocsPages} />
        <PrivateRoute path="/friends" component={FriendsPage} />
        <PrivateRoute path="/nodes" component={NodePages} />
        <PrivateRoute path="/messages" component={MessagesPage} />
        <PrivateRoute path="/notifications" component={NotificationsPage} />
        <Route component={() => <>404 not found</>} />
      </Switch>
    </Router>
  )
}

export const history = createBrowserHistory()