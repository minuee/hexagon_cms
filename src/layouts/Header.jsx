import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Grid, Box, Avatar, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { AccountCircle } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100px",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "solid 1px #ddd",
  },
  logo_box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: "350px",
    height: "100%",

    "& > *": {
      width: "10rem",
      height: "60%",
      cursor: "pointer",

      "& > img": {
        objectFit: "contain",
      },
    },
  },

  account: {
    "& > *": {
      marginRight: "0.6rem",
    },
    "& > :first-child": {
      fontSize: "3rem",
      color: "#aaa",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  function handleSignOut() {
    dispatch({
      type: "SIGN_OUT",
    });
    localStorage.removeItem("hexagon_cms_token");
  }

  return (
    <Grid container className={classes.container}>
      <Box bgcolor="secondary.main" className={classes.logo_box}>
        <Avatar variant="square" src="/image/logo_white.png" onClick={() => history.push("/")} />
      </Box>

      <Box display="flex" alignItems="stretch" mr={2}>
        <Grid container alignItems="center" className={classes.account}>
          <AccountCircle color="inherit" />
          <Typography fontWeight={500}>관리자</Typography>
        </Grid>

        <Button p={3} variant="contained" color="primary" onClick={handleSignOut}>
          Logout
        </Button>
      </Box>
    </Grid>
  );
};

export default Header;
