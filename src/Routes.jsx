import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

import { Layout } from "./layouts";
import { Home } from "./pages/Home";
import { UserList, UserDetail } from "./pages/User";
import { PurchaseList, PurchaseDetail } from "./pages/Purchase";
import { CategoryList, CategoryDetail, ItemList, ItemDetail } from "./pages/Product";
import { PopupList, PopupDetail } from "./pages/Popup";
import { NoticeList, NoticeDetail } from "./pages/Notice";

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

        <Route exact path="/product/category/:category_no" component={CategoryDetail} />
        <Route path="/product/category" component={CategoryList} />
        <Route exact path="/product/item/:item_no" component={ItemDetail} />
        <Route path="/product/item" component={ItemList} />
        <Redirect from="/product" to="/product/category" />

        <Route exact path="/popup/:popup_type_1/:popup_type_2/:popup_no" component={PopupDetail} />
        <Route path="/popup" component={PopupList} />

        <Route exact path="/notice/:notice_no" component={NoticeDetail} />
        <Route path="/notice" component={NoticeList} />

        <Redirect to="/" />
      </Switch>
    </Layout>
  );
};

export default Routes;
