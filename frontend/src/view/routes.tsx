import React, { useState } from "react";
import { createBrowserHistory } from "history";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { StoreTypes } from "src/types";
import NoHubsPage from "./pages/NoHubsPage";
import ProfilePage from "./features/Profile/pages";
// import DocsPages from "./pages/DocsPages";
import { DashboardPage } from "@view/pages/DashboardPage";
import selectors from "@selectors/index";
import { LastLocationProvider } from "react-router-last-location";
import { useSwipeable } from "react-swipeable";
import { ForwardIconWrapper, BackIconWrapper } from "./shared/styles";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { PageLayout } from "@view/shared/PageLayout";
import FriendsPages from "@view/features/Friends/pages";
import GroupsPages from "@view/features/Groups/pages";
import FeedPage from "@view/features/Feed/pages";
import AuthPages from "@view/features/Auth/pages";
import { SettingsPages } from "@view/features/Settings/pages";
import MessagesPage from "@view/features/Messages/pages";
import HubListPage from '@view/pages/HubPages/HubListPage'

export const history = createBrowserHistory();

const Private = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (rest.isLogged) {
          return rest.isEmailConfirmed ? (
            <Component {...props} />
          ) : (
            <Redirect to="/resend-confirm-email" />
          );
        }
        return <Redirect to="/login" />;
      }}
    />
  );
};

const mapStateToProps = (state: StoreTypes) => ({
  isLogged: selectors.authorization.isLogged(state),
  isEmailConfirmed: selectors.profile.isEmailConfirmed(state),
});

const PrivateRoute = connect(mapStateToProps)(Private);

export const Routes = () => {
  const [swipeType, setSwipeType] = useState("");

  const handlers = useSwipeable({
    onSwiped: () => {
      if (swipeType === "") return;
      setSwipeType("");
    },
    onTap: () => {
      if (swipeType === "") return;
      setSwipeType("");
    },
    onSwiping: (event) => {
      if (swipeType === event?.dir) return;

      if (event?.dir === "Left") {
        setSwipeType(event?.dir);
      }

      if (event?.dir === "Right") {
        setSwipeType(event?.dir);
      }
    },
    onSwipedLeft: () => {
      if (history.length) {
        history.goForward();
      }
    },
    onSwipedRight: () => {
      if (history.length - 1 !== 0) {
        history.goBack();
      }
    },
    delta: 50,
  });

  return (
    <Router history={history}>
      <div {...handlers}>
        <LastLocationProvider>
          <BackIconWrapper className={swipeType === "Right" ? "visible" : ""}>
            <ArrowBackIcon />
          </BackIconWrapper>
          <ForwardIconWrapper className={swipeType === "Left" ? "visible" : ""}>
            <ArrowForwardIcon />
          </ForwardIconWrapper>
          <PageLayout>
            <Switch>
              {/* <Route path="/docs" component={DocsPages} /> */}
              <Route path="/no-hubs" component={NoHubsPage} />
              <PrivateRoute path="/dashboard" component={DashboardPage} />
              <PrivateRoute path="/settings" component={SettingsPages} />
              <PrivateRoute path="/messages" component={MessagesPage} />
              <PrivateRoute path="/profile" component={ProfilePage} />
              <PrivateRoute path="/friends" component={FriendsPages} />
              <PrivateRoute path="/groups" component={GroupsPages} />
              <PrivateRoute path="/feed" component={FeedPage} />
              <PrivateRoute path="/hubslist" component={HubListPage} />
              <AuthPages />
              <Route component={() => <>404 not found</>} />
            </Switch>
          </PageLayout>
        </LastLocationProvider>
      </div>
    </Router>
  );
};
