import React, { FC, createElement } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { LoginPage } from '@view/pages/LoginPage'

export const Routes: FC = () => (
  <Router history={history}>
    <Switch>
      <Route path="/login" component={LoginPage} />
      <PrivateRoute path="/private-route" component={<>Private</>} />
      {/* <Redirect from="/" to="/" /> */}
    </Switch>
  </Router>
)

export const history = createBrowserHistory()

const PrivateRoute = ({ component, ...rest }) => {
  const routeComponent = props =>
    true ? createElement(component, props) : <Redirect to={{ pathname: '/login' }} />

  return <Route {...rest} render={routeComponent} />
}
