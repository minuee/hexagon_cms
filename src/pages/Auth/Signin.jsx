import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Avatar, Box, Container, TextField, InputAdornment } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { PersonOutline, LockOutlined } from "@material-ui/icons";
import { useForm } from "react-hook-form";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  logo: {
    width: "20rem",
    height: "7rem",
    marginBottom: "2rem",
    "& img": {
      objectFit: "contain",
    },
  },

  input: {
    width: "22rem",
    marginTop: "0.5rem",
  },
});

export const SignIn = ({}) => {
  const classes = useStyles();
  const history = useHistory();
  const { register, errors, handleSubmit } = useForm();

  function handleSignin(data) {
    console.log(data);
  }

  return (
    <Container maxWidth="md">
      <Box className={classes.wrapper}>
        <Avatar className={classes.logo} variant="square" src="/image/logo_color.png" />

        <TextField
          className={classes.input}
          variant="outlined"
          name="email"
          placeholder="Email"
          inputRef={register({ required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline />
              </InputAdornment>
            ),
          }}
          error={!!errors?.email}
        />
        <TextField
          className={classes.input}
          variant="outlined"
          name="password"
          placeholder="Password"
          inputRef={register({ required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined />
              </InputAdornment>
            ),
          }}
          error={!!errors?.password}
        />

        <Box display="flex" alignItems="center" mt={2} mb={6}>
          <Button variant="text" onClick={() => history.push("/finduserinfo")}>
            아이디/패스워드 찾기
          </Button>
          &#x0007C;
          <Button variant="text" onClick={() => history.push("/signup")}>
            회원가입
          </Button>
        </Box>

        <Button variant="contained" color="primary" px={18} py={2} onClick={handleSubmit(handleSignin)}>
          <Typography variant="h6" fontWeight={"700"}>
            로그인
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};
