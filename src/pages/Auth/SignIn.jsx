import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { encrypt, decrypt } from "common";
import { apiObject } from "api";
import Cookies from "js-cookie";

import {
  makeStyles,
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { PersonOutline, LockOutlined, HighlightOff } from "@material-ui/icons";
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

  option_checkbox: {},
});

export const SignIn = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { control, register, setValue, errors, handleSubmit } = useForm();

  async function signIn(form) {
    if ( form.user_id != 'superbinder') {
      alert("아이디가 잘못된 계정입니다.");
      return;
    }else{
      let resp = await apiObject.signIn(form);

      if (resp.code === "1015") {
        alert("로그인 정보가 잘못되었습니다");
        return;
      }

      localStorage.setItem("hexagon_cms_token", resp.token);

      if (form.store_id_yn) {
        Cookies.set("id", encrypt(form.user_id), { expires: 36500 });
      } else {
        Cookies.remove("id");
      }

      dispatch({
        type: "SIGN_IN",
      });
    }
  }

  useEffect(() => {
    if (Cookies.get("id")) {
      setValue("user_id", decrypt(Cookies.get("id")));
      setValue("store_id_yn", true);
    }
  }, []);

  return (
    <Container maxWidth="md">
      <Box className={classes.wrapper}>
        <ImageBox src="/image/logo_color.png" width="20rem" height="7rem" mb={4} />

        <TextField
          // defaultValue="superbinder"
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
            endAdornment: (
              <IconButton onClick={() => setValue("user_id", "")}>
                <HighlightOff />
              </IconButton>
            ),
          }}
          error={!!errors?.user_id}
        />
        <Box pl={1} width="22rem">
          <Controller
            render={({ value, onChange }) => (
              <FormControlLabel
                className={classes.option_checkbox}
                control={<Checkbox color="primary" size="small" />}
                onChange={(e) => onChange(e.target.checked)}
                checked={value}
                label={<Typography variant="subtitle2">아이디 기억하기</Typography>}
              />
            )}
            control={control}
            name="store_id_yn"
            defaultValue={false}
          />
        </Box>
        <TextField
          //defaultValue="hexagon12!@"
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
            endAdornment: (
              <IconButton onClick={() => setValue("password", "")}>
                <HighlightOff />
              </IconButton>
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

        <Box mt={3} mb={2}></Box>

        <Button variant="contained" color="primary" px={18} py={2} onClick={handleSubmit(signIn)}>
          <Typography variant="h6" fontWeight={"700"}>
            로그인
          </Typography>
        </Button>
      </Box>
    </Container>
  );
};
