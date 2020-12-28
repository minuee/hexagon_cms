import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

const Routes = () => {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
};

const AuthRoutes = () => {
  return (
    <Switch>
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/finduserinfo" component={FindUserInfo} />
      <Redirect to="/signin" />
    </Switch>
  );
};

export default Routes;
