import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Auth from "./pages/Auth";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Auth />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
