import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

import { Layout } from "./layouts";
import { Home } from "./pages/Home";
import { UserList, UserDetail } from "./pages/User";
import { PurchaseList, PurchaseDetail } from "./pages/Purchase";

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

        <Route exact path="/user/:user_no" component={UserDetail} />
        <Route path="/user" component={UserList} />

        <Route exact path="/purchase/:purchase_no" component={PurchaseDetail} />
        <Route path="/purchase" component={PurchaseList} />

        <Redirect to="/" />
      </Switch>
    </Layout>
  );
};

export default Routes;
