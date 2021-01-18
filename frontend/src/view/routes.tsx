import React, { useState } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import LoginPage from '@view/pages/LoginPage'
import { FriendsPage } from '@view/pages/FriendsPage'
import { connect } from 'react-redux'
import { StoreTypes } from 'src/types'
import { HubPages } from './pages/HubPages'
import { MessagesPage } from './pages/MessagesPage'
import { NotificationsPage } from './pages/NotificationsPage'
import NoHubsPage from './pages/NoHubsPage'
import ProfilePage from './pages/ProfilePage'
import RegistrationPage from './pages/RegistrationPage'
import DocsPages from './pages/DocsPages'
import ConfirmUserPage from '@view/pages/ConfirmUserPage'
import ResendConfirmEmailPage from '@view/pages/ResendConfirmEmailPage'
import ForgotPasswordPage from '@view/pages/ForgotPasswordPage'
import ForgotUserNamePage from '@view/pages/ForgotUserNamePage'
import ResetPasswordPage from '@view/pages/ResetPasswordPage'
import { DashboardPage } from '@view/pages/DashboardPage'
import selectors from '@selectors/index'
import { LastLocationProvider } from 'react-router-last-location'
import { useSwipeable } from 'react-swipeable'
import { ForwardIconWrapper, BackIconWrapper } from './shared/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import MyGroups from '@view/pages/GroupPages/MyGroups'
import PublicGroups from '@view/pages/GroupPages/PublicGroups'
import CreateGroupPage from '@view/pages/GroupPages/CreateGroupPage'
import EditGroupPage from '@view/pages/GroupPages/EditGroupPage'
import { GroupPage } from '@view/pages/GroupPages/GroupPage'

export const history = createBrowserHistory()

const Private = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => {
      if (rest.isLogged) {
        return rest.isEmailConfirmed ? <Component {...props} /> : <Redirect to="/resend-confirm-email" />
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
  const [swipeType, setSwipeType] = useState('')

  const handlers = useSwipeable({
    onSwiped: () => {
      if (swipeType === '') return
      setSwipeType('')
    },
    onTap: () => {
      if (swipeType === '') return
      setSwipeType('')
    },
    onSwiping: (event) => {
      if (swipeType === event?.dir) return

      // if (event?.dir === 'Left' && history.length !== history.index + 1) {
      if (event?.dir === 'Left') {
        setSwipeType(event?.dir)
      }

      // if (event?.dir === 'Right' && history.length - 1 !== 0) {
      if (event?.dir === 'Right') {
        setSwipeType(event?.dir)
      }
    },
    onSwipedLeft: () => {
      // if (history.length !== history.index + 1) {
      if (history.length) {
        history.goForward()
      }
    },
    onSwipedRight: () => {
      if (history.length - 1 !== 0) {
        history.goBack()
      }
    },
    delta: 50,
    // trackMouse: true
    // preventDefaultTouchmoveEvent: true,
  })

  return (
    <Router history={history}>
      <div {...handlers} >
        <LastLocationProvider>
          <BackIconWrapper className={swipeType === 'Right' ? 'visible' : ''}><ArrowBackIcon /></BackIconWrapper>
          <ForwardIconWrapper className={swipeType === 'Left' ? 'visible' : ''}><ArrowForwardIcon /></ForwardIconWrapper>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/registration" component={RegistrationPage} />
            <Route path="/forgot-password" component={ForgotPasswordPage} />
            <Route path="/forgot-username" component={ForgotUserNamePage} />
            <Route path="/reset-password" component={ResetPasswordPage} />
            <Route path="/docs" component={DocsPages} />
            <Route path="/confirm-user" component={ConfirmUserPage} />
            <Route path="/resend-confirm-email" component={ResendConfirmEmailPage} />
            <Route path="/no-hubs" component={NoHubsPage} />

            <PrivateRoute path="/friends" component={FriendsPage} />
            <PrivateRoute exact path="/groups" component={MyGroups} />
            <PrivateRoute path="/groups/my" component={MyGroups} />
            <PrivateRoute path="/groups/public" component={PublicGroups} />
            <PrivateRoute path="/groups/group" exact component={GroupPage} />
            <PrivateRoute path="/groups/create" exact component={CreateGroupPage} />
            <PrivateRoute path="/groups/edit" exact component={EditGroupPage} />
            <PrivateRoute path="/hubs" component={HubPages} />
            <PrivateRoute path="/messages" component={MessagesPage} />
            <PrivateRoute path="/notifications" component={NotificationsPage} />
            <PrivateRoute path="/profile" component={ProfilePage} />
            <PrivateRoute path="/dashboard" component={DashboardPage} />
            
            <Route component={() => <>404 not found</>} />
          </Switch>
        </LastLocationProvider>
      </div>
    </Router>
  )
}
