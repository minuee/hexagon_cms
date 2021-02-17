import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ImageBox } from "components";

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
    },
  },

  account: {
    display: "flex",
    alignItems: "center",
    marginRight: theme.spacing(5),

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
  const { member } = useSelector((state) => state.reducer);

  function handleSignOut() {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      dispatch({
        type: "SIGN_OUT",
      });
      localStorage.removeItem("hexagon_cms_token");
      localStorage.removeItem("hexagon_is_salesman");
    }
  }

  return (
    <Grid container className={classes.container}>
      <Box bgcolor="secondary.main" className={classes.logo_box}>
        <ImageBox src="/image/logo_white.png" onClick={() => history.push("/")} />
      </Box>

      <Box display="flex" alignItems="stretch" mr={2}>
        <Box className={classes.account}>
          <AccountCircle color="inherit" />
          <Typography fontWeight={500}>{member?.name}</Typography>
        </Box>

        <Button p={3} variant="contained" color="primary" onClick={handleSignOut}>
          Logout
        </Button>
      </Box>
    </Grid>
  );
};

export default Header;
