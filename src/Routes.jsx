import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { Dashboard } from "./layouts";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

import { AdminHome } from "./pages/Admin/Home";
import { UserList, UserDetail } from "./pages/Admin/User";
import { SalesmanList, SalesmanDetail, SalesmanRegister, SalesmanIncentive } from "./pages/Admin/Salesman";
import { PurchaseList, PurchaseDetail } from "./pages/Admin/Purchase";
import { CategoryList, CategoryDetail, ItemList, ItemDetail } from "./pages/Admin/Product";
import { EventList, EventDetail } from "./pages/Admin/Event";
import { PopupList, PopupDetail } from "./pages/Admin/Popup";
import { NoticeList, NoticeDetail } from "./pages/Admin/Notice";
import { CouponList, CouponDetail } from "./pages/Admin/Coupon";

import { SalesmanHome } from "./pages/Salesman/Home";
import { MemberList, MemberDetail } from "./pages/Salesman/Member";
import { IncentiveList, IncentiveDetail, UserPurchaseDetail } from "./pages/Salesman/Incentive";
import { Setting } from "./pages/Salesman/Setting";

const Routes = () => {
  const { userState, isSalesman } = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  let token = localStorage.getItem("hexagon_cms_token");
  let is_salesman = localStorage.getItem("hexagon_is_salesman");

  useEffect(() => {
    if (!token) {
      dispatch({ type: "SIGN_OUT" });
    }
  }, [token]);

  useEffect(() => {
    dispatch({
      type: "SET_IS_SALESMAN",
      payload: JSON.parse(is_salesman),
    });
  }, [is_salesman]);

  return (
    <BrowserRouter>
      {userState === "NOT_SIGN" ? <AuthRoutes /> : isSalesman ? <SalesmanRoutes /> : <AdminRoutes />}
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

const AdminRoutes = () => {
  return (
    <Dashboard>
      <Switch>
        <Route exact path="/" component={AdminHome} />

        <Route exact path="/user/:member_pk" component={UserDetail} />
        <Route path="/user" component={UserList} />

        <Route exact path="/purchase/:purchase_no" component={PurchaseDetail} />
        <Route path="/purchase" component={PurchaseList} />

        <Route exact path="/product/category/:category_pk" component={CategoryDetail} />
        <Route path="/product/category" component={CategoryList} />
        <Route exact path="/product/item/:product_pk" component={ItemDetail} />
        <Route path="/product/item" component={ItemList} />
        <Redirect from="/product" to="/product/category" />

        <Route path="/event/:event_pk" component={EventDetail} />
        <Route path="/event" component={EventList} />

        <Route exact path="/popup/:popup_type_1/:popup_type_2/:popup_no" component={PopupDetail} />
        <Route path="/popup" component={PopupList} />

        <Route exact path="/notice/:notice_no" component={NoticeDetail} />
        <Route path="/notice" component={NoticeList} />

        <Route path="/coupon/:coupon_pk" component={CouponDetail} />
        <Route path="/coupon" component={CouponList} />

        <Route exact path="/salesman/add" component={SalesmanRegister} />
        <Route exact path="/salesman/incentive/:month_no" component={SalesmanIncentive} />
        <Route exact path="/salesman/:member_pk" component={SalesmanDetail} />
        <Route path="/salesman" component={SalesmanList} />

        <Redirect to="/" />
      </Switch>
    </Dashboard>
  );
};

const SalesmanRoutes = () => {
  return (
    <Dashboard>
      <Switch>
        <Route exact path="/" component={SalesmanHome} />

        <Route exact path="/member/:member_pk" component={MemberDetail} />
        <Route path="/member" component={MemberList} />

        <Route exact path="/incentive/:incentive_pk/:purchase_no" component={UserPurchaseDetail} />
        <Route exact path="/incentive/:incentive_pk" component={IncentiveDetail} />
        <Route path="/incentive" component={IncentiveList} />

        <Route path="/setting" component={Setting} />

        <Redirect to="/" />
      </Switch>
    </Dashboard>
  );
};

export default Routes;
