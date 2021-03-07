import React, { useState } from 'react'
import { createBrowserHistory } from 'history'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { StoreTypes } from 'src/types'
import HubListPage from './pages/HubPages/HubListPage'
import { MessagesPage } from './pages/MessagesPage'
import { NotificationsPage } from './pages/NotificationsPage'
import NoHubsPage from './pages/NoHubsPage'
import ProfilePage from './features/Profile/pages'
import DocsPages from './pages/DocsPages'
import { DashboardPage } from '@view/pages/DashboardPage' 
import selectors from '@selectors/index'
import { LastLocationProvider } from 'react-router-last-location'
import { useSwipeable } from 'react-swipeable'
import { ForwardIconWrapper, BackIconWrapper } from './shared/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { PageLayout } from '@view/shared/PageLayout'
import FriendsPages from '@view/features/Friends/pages'
import GroupsPages from '@view/features/Groups/pages'
import AuthPages from '@view/features/Auth/pages'
import { SettingsPages } from '@view/features/Settings/pages'

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
          <PageLayout>
            <Switch>
              <Route path="/docs" component={DocsPages} />
              <Route path="/no-hubs" component={NoHubsPage} />
              <PrivateRoute path="/dashboard" component={DashboardPage} />
              <PrivateRoute path="/hubs/list" component={HubListPage} />
              <PrivateRoute path="/messages" component={MessagesPage} />
              <PrivateRoute path="/notifications" component={NotificationsPage} />
              
              <PrivateRoute path="/settings" component={SettingsPages} />
              <PrivateRoute path="/profile" component={ProfilePage} />
              <PrivateRoute path="/friends" component={FriendsPages} />
              <PrivateRoute path="/groups" component={GroupsPages} />
              <AuthPages/>   
              <Route component={() => <>404 not found</>} />
            </Switch>
          </PageLayout>
        </LastLocationProvider>
      </div>
    </Router>
  )
}
