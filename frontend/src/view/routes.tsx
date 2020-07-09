import React, { createElement } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from '@view/pages/LoginPage'
import { FriendsPage } from '@view/pages/FriendsPage'
import { connect } from 'react-redux'
import { StoreTypes } from './../types'
import { WithTopBar } from '@view/shared/WithTopBar'
import { NodePages } from './pages/NodePages'
import DocsPages from './pages/DocsPages'

const PrivateRoute = ({ component, ...rest }) => {
  const routeComponent = props =>
    rest.isLogged ? createElement(component, props) : <Redirect to={{ pathname: '/login' }} />
  return <Route {...rest} render={routeComponent} />
}

export const RoutesComponent: React.SFC<Props> = (props) => {
  const { isLogged } = props

  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/docs" component={DocsPages} />
        <WithTopBar>
          <PrivateRoute isLogged={isLogged} path="/friends" component={FriendsPage} />
          <PrivateRoute isLogged={isLogged} path="/nodes" component={NodePages} />
        </WithTopBar>
        <Redirect exact from="/" to="/login" />
      </Switch>
    </Router>
  )
}

type StateProps = Pick<Props, 'isLogged'>
const mapStateToProps = (state: StoreTypes): StateProps => ({
  isLogged: state.authorization.isLogged,
})

interface Props {
  isLogged: boolean
}

export const Routes = connect(mapStateToProps)(RoutesComponent)
export const history = createBrowserHistory()