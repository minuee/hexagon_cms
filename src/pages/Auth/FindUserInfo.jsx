import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, Container, TextField, InputAdornment } from "@material-ui/core";
import { PhoneOutlined, LockOutlined } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form_wrapper: {
    display: "flex",
    flexDirection: "column",

    "& > *": {
      marginBottom: "0.5rem",
    },
  },

  input: {
    width: "26rem",

    "& .MuiInputBase-root": {
      paddingRight: "unset",
    },

    "& .MuiButton-root": {
      width: "6rem",
      boxShadow: "none",

      borderTopLeftRadius: "unset",
      borderBottomLeftRadius: "unset",
      padding: theme.spacing(2),
    },
  },
  result_label: {
    color: "#979797",
    fontWeight: "500",
  },
}));

export const FindUserInfo = ({}) => {
  const classes = useStyles();
  const history = useHistory();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [userInfo, setUserInfo] = useState();

  function handleSendCertificateNum() {}

  function handleCheckCertificateNum() {
    setUserInfo({
      email: "ingo",
      password: "changchang",
    });
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Box className={classes.wrapper}>
        <ImageBox src="/image/logo_color.png" width="20rem" height="7rem" mb={4} />

        <Box className={classes.form_wrapper} mb={7}>
          <Typography>아이디/패스워드찾기</Typography>

          <TextField
            className={classes.input}
            type="number"
            variant="outlined"
            placeholder="휴대폰번호"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendCertificateNum()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!phoneNumber.match(/^\d{10,11}$/)}
                  onClick={handleSendCertificateNum}
                >
                  전송
                </Button>
              ),
            }}
          />
          <TextField
            className={classes.input}
            type="number"
            variant="outlined"
            placeholder="인증번호 4자리"
            value={certificationNumber}
            onChange={(e) => setCertificationNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheckCertificateNum()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined />
                </InputAdornment>
              ),
              endAdornment: (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!certificationNumber.match(/^\d{4}$/)}
                  onClick={handleCheckCertificateNum}
                >
                  확인
                </Button>
              ),
            }}
          />

          <Box visibility={userInfo ? "unset" : "hidden"}>
            <Typography>
              <span className={classes.result_label}>Email - </span>
              {userInfo?.email}
            </Typography>
            <Typography>
              <span className={classes.result_label}>Password - </span>
              {userInfo?.password}
            </Typography>
          </Box>
        </Box>

        <Button variant="contained" color="primary" px={14} py={2} onClick={() => history.push("signin")}>
          로그인페이지 이동
        </Button>
      </Box>
    </Container>
  );
};
