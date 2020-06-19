import React from "react";
import { Route, Switch } from "react-router";
import APP_ROUTES from "./constants/app-routes";

import HomePage from "./components/home-page";
import SignIn from "./components/auth/sign-in";
import SignUp from "./components/auth/sign-up";

import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

export default function configureRoutes() {
  return (
    <Switch>
      <Route exact path={APP_ROUTES.home} component={HomePage} />
      <Route exact path={APP_ROUTES.signIn} component={SignIn} />
      <Route exact path={APP_ROUTES.signUp} component={SignUp} />
    </Switch>
  );
}
