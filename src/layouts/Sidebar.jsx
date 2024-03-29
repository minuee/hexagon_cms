import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import jwt from "jsonwebtoken";

import { Box, makeStyles } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Typography } from "components/materialui";

const admin_page = [
  {
    label: `홈`,
    path: `/`,
  },
  {
    label: `환경설정`,
    path: `/setup`,
  },
  {
    label: `회원관리`,
    path: `/member`,
  },
  {
    label: `주문내역`,
    path: `/order`,
  },
  {
    label: `상품관리`,
    path: `/product`,
  },
  {
    label: `이벤트관리`,
    path: `/event`,
  },
  {
    label: `팝업관리`,
    path: `/popup`,
  },
  {
    label: `공지관리`,
    path: `/notice`,
  },
  {
    label: `홈피공지관리`,
    path: `/webnotice`,
  },
  {
    label: `쿠폰관리`,
    path: `/coupon`,
  },
  {
    label: `포인트관리`,
    path: `/point`,
  },
  {
    label: `배너관리`,
    path: `/banner`,
  },
  {
    label: `영업사원관리`,
    path: `/salesman`,
  },
];
const salesman_page = [
  {
    label: `홈`,
    path: `/`,
  },
  {
    label: `회원관리`,
    path: `/member`,
  },
  {
    label: `회원주문내역`,
    path: `/order`,
  },
  {
    label: `인센티브내역`,
    path: `/incentive`,
  },
  {
    label: `설정`,
    path: `/setting`,
  },
];

const useStyles = makeStyles((theme) => ({
  container: {
    minHeight: "calc(100vh - 100px)",
    width: "250px",
    background: theme.palette.secondary.main,

    "& a": {
      color: "#fff",
      textDecoration: "none",

      "& > *": {
        borderBottom: "solid 1px #222",
      },
    },
  },

  nav_selected: {
    "& > *": {
      color: "#222",
      background: "#fff",
    },
  },
}));

const Sidebar = () => {
  const is_salesman = jwt.decode(localStorage.getItem("hexagon_cms_token"))?.is_salesman;
  const classes = useStyles();
  const location = useLocation();

  function checkIsActive(m, l) {
    if (m?.url) {
      return true;
    }
    return false;
  }

  return (
    <Box className={classes.container}>
      {(is_salesman ? salesman_page : admin_page).map((nav) => {
        let isCur = nav.path.substring(1) === location.pathname.split("/")[1];
        return (
          <NavLink to={nav.path} activeClassName={classes.nav_selected} key={nav.label} isActive={checkIsActive}>
            <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2}>
              <Typography variant="h6" display="inline">
                {nav.label}
              </Typography>
              {isCur && <KeyboardArrowRight />}
            </Box>
          </NavLink>
        );
      })}
    </Box>
  );
};

export default Sidebar;
