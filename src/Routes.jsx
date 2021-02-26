import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";

import { Dashboard } from "./layouts";

import { SignIn, SignUp, FindUserInfo } from "./pages/Auth";

import { AdminHome } from "./pages/Admin/Home";
import { MemberList, MemberDetail } from "./pages/Admin/Member";
import { SalesmanList, SalesmanDetail, SalesmanRegister, SalesmanIncentive } from "./pages/Admin/Salesman";
import { OrderList, OrderDetail } from "./pages/Admin/Order";
import { CategoryList, CategoryDetail, ItemList, ItemDetail } from "./pages/Admin/Product";
import { EventList, EventDetail } from "./pages/Admin/Event";
import { PopupList, PopupRegister, PopupDetail } from "./pages/Admin/Popup";
import { NoticeList, NoticeDetail } from "./pages/Admin/Notice";
import { CouponList, CouponRegister, CouponDetail } from "./pages/Admin/Coupon";
import { BannerList, BannerDetail } from "./pages/Admin/Banner";

import { SalesmanHome } from "./pages/Salesman/Home";
import { ManageMemberList, ManageMemberDetail } from "./pages/Salesman/Member";
import { IncentiveList, IncentiveDetail, UserPurchaseDetail } from "./pages/Salesman/Incentive";
import { Setting } from "./pages/Salesman/Setting";

const Routes = () => {
  const { userState } = useSelector((state) => state.reducer);
  const dispatch = useDispatch();

  let token = localStorage.getItem("hexagon_cms_token");
  let is_admin = !!localStorage.getItem("hexagon_is_admin");

  useEffect(() => {
    if (!token) {
      dispatch({ type: "SIGN_OUT" });
    } else {
      dispatch({ type: "SET_MEMBER", payload: jwt.decode(token) });
    }
  }, [token]);

  useEffect(() => {
    dispatch({
      type: "SET_IS_ADMIN",
      payload: is_admin,
    });
  }, [is_admin]);

  return (
    <BrowserRouter>
      {userState === "NOT_SIGN" ? <AuthRoutes /> : is_admin ? <AdminRoutes /> : <SalesmanRoutes />}
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

        <Route exact path="/member/:member_pk" component={MemberDetail} />
        <Route path="/member" component={MemberList} />

        <Route exact path="/order/:order_pk" component={OrderDetail} />
        <Route path="/order" component={OrderList} />

        <Route exact path="/product/category/:category_pk" component={CategoryDetail} />
        <Route path="/product/category" component={CategoryList} />
        <Route exact path="/product/item/:product_pk" component={ItemDetail} />
        <Route path="/product/item" component={ItemList} />
        <Redirect from="/product" to="/product/category" />

        <Route path="/event/:event_pk" component={EventDetail} />
        <Route path="/event" component={EventList} />

        <Route exact path="/popup/add/:popup_gubun" component={PopupRegister} />
        <Route exact path="/popup/:popup_gubun/:popup_pk" component={PopupDetail} />
        <Route path="/popup" component={PopupList} />

        <Route exact path="/notice/:notice_pk" component={NoticeDetail} />
        <Route path="/notice" component={NoticeList} />

        <Route path="/coupon/add" component={CouponRegister} />
        <Route path="/coupon/:coupon_pk" component={CouponDetail} />
        <Route path="/coupon" component={CouponList} />

        <Route path="/banner/:banner_pk" component={BannerDetail} />
        <Route path="/banner" component={BannerList} />

        <Route exact path="/salesman/add" component={SalesmanRegister} />
        <Route exact path="/salesman/incentive/:member_pk/:sales_month" component={SalesmanIncentive} />
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

        <Route exact path="/member/:member_pk" component={ManageMemberDetail} />
        <Route path="/member" component={ManageMemberList} />

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
