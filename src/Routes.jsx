import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

import { Layout } from "./layouts";
import { Home } from "./pages/Home";
import { User } from "./pages/User";

const Routes = () => {
  const { userState } = useSelector((state) => state.reducer);

  return <BrowserRouter>{userState === "NOT_SIGN" ? <AuthRoutes /> : <MainRoutes />}</BrowserRouter>;
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

const MainRoutes = () => {
  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/user" component={User} />
        <Redirect to="/" />
      </Switch>
    </Layout>
  );
};

export default Routes;
