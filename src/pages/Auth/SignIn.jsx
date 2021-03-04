import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { apiObject } from "api";

import { makeStyles, Box, Container, TextField, InputAdornment, Checkbox, FormControlLabel } from "@material-ui/core";
import { PersonOutline, LockOutlined } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ImageBox } from "components";

const useStyles = makeStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  input: {
    width: "22rem",
    marginTop: "0.5rem",
  },
});

export const SignIn = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, errors, handleSubmit } = useForm();

  async function signIn(data) {
    let resp = await apiObject.signIn(data);

    if (resp.code === "1015") {
      alert("로그인 정보가 잘못되었습니다");
      return;
    }

    localStorage.setItem("hexagon_cms_token", resp.token);

    dispatch({
      type: "SIGN_IN",
    });
  }

  return (
    <Container maxWidth="md">
      <Box className={classes.wrapper}>
        <ImageBox src="/image/logo_color.png" width="20rem" height="7rem" mb={4} />

        <TextField
          defaultValue="superbinder"
          // defaultValue="123456789"
          className={classes.input}
          name="user_id"
          placeholder="ID"
          inputRef={register({ required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutline />
              </InputAdornment>
            ),
          }}
          error={!!errors?.user_id}
        />
        <TextField
          defaultValue="hexagon12!@"
          // defaultValue="lenapark47##"
          className={classes.input}
          name="password"
          placeholder="Password"
          type="password"
          inputRef={register({ required: true })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlined />
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(signIn)()}
          error={!!errors?.password}
        />

        {/* <Box display="flex" alignItems="center" mt={2}>
          <Button  variant="text" onClick={() => history.push("/finduserinfo")}>아이디/패스워드 찾기</Button>
          &#x0007C;
          <Button  variant="text" onClick={() => history.push("/signup")}>회원가입</Button>
        </Box> */}

        <Box mt={1} mb={4}>
          {/* <FormControlLabel
            control={<Checkbox inputRef={register} color="primary" />}
            name="is_salesman"
            label="영업사원으로 로그인하기"
          /> */}
        </Box>

        <Button variant="contained" color="primary" px={18} py={2} onClick={handleSubmit(signIn)}>
          <Typography variant="h6" fontWeight={"700"}>
            로그인
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};
