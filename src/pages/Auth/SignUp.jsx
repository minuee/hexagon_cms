import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  makeStyles,
  Avatar,
  Box,
  Container,
  TextField,
  FormControlLabel,
  Checkbox,
  InputLabel,
} from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
  },
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    alignSelf: "center",
    width: "20rem",
    height: "7rem",
    marginBottom: "2rem",

    "& img": {
      objectFit: "contain",
    },
  },

  input: {
    width: "22rem",
    marginBottom: "0.5rem",
  },
  lisence_input: {
    width: "22rem",
    marginBottom: "0.5rem",
    border: "solid 1px  rgb(0, 0, 0, 0.23)",
    borderRadius: "4px",
    padding: "18.5px 14px",
  },

  flex: {
    display: "flex",
  },
});

export const SignUp = ({}) => {
  const classes = useStyles();
  const history = useHistory();
  const { register, control, errors, setValue, watch, handleSubmit } = useForm();

  function handleWholeTermCheck(e) {
    setValue("agree_vital", e.target.checked);
    setValue("agree_marketing", e.target.checked);
  }

  function handleSignUp(data) {
    console.log(data);

    alert("회원가입 신청 완료!");

    history.push("/");
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Box mt={16} mb={8} className={classes.wrapper}>
        <Avatar className={classes.logo} variant="square" src="/image/logo_color.png" />
        <Box mt={5} mb={3}>
          <Typography fontWeight={700}>회원가입</Typography>
        </Box>

        {/* form section */}
        <>
          <TextField
            className={classes.input}
            variant="outlined"
            name="user_id"
            placeholder="아이디 (4자~20자)"
            inputRef={register({
              required: true,
              pattern: /^\w{4,20}$/,
            })}
            error={!!errors?.user_id}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            name="password_1"
            placeholder="비밀번호 (8자 이상 영문+숫자+특수문자)"
            inputRef={register({
              required: true,
              pattern: /^\S{8,}$/,
            })}
            error={!!errors?.password_1}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            name="password_2"
            placeholder="비밀번호 재확인"
            inputRef={register({
              required: true,
              pattern: /^\S{8,}$/,
            })}
            error={!!errors?.password_2}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            name="email"
            placeholder="이메일 주소"
            inputRef={register({
              required: true,
              pattern: /^\w+\@\w+\.\w+$/,
            })}
            error={!!errors?.email}
          />

          <InputLabel
            className={classes.lisence_input}
            htmlFor="lisence_img"
            style={{ color: watch("lisence_img", false)[0]?.name ? "#000" : "#8a8a8a" }}
          >
            {watch("lisence_img", false)[0]?.name || "사업자등록증 사진"}
          </InputLabel>
          <input
            type="file"
            accept="image/*"
            id="lisence_img"
            name="lisence_img"
            ref={register({
              required: true,
            })}
            style={{ display: "none" }}
          />

          <TextField
            className={classes.input}
            variant="outlined"
            name="name"
            placeholder="이름"
            inputRef={register({
              required: true,
            })}
            error={!!errors?.name}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            name="phone_number"
            placeholder="휴대폰 번호 (-를 빼고 입력)"
            inputRef={register({
              required: true,
              pattern: /^\d{10,11}$/,
            })}
            error={!!errors?.phone_number}
          />
        </>

        {/* terms */}
        <Box my={5} ml={1}>
          {/* <Box mb={1}>
            <FormControlLabel
              className={classes.flex}
              control={<Checkbox color="primary" />}
              label="전체 약관에 동의합니다"
            />
          </Box> */}
          <Box mb={2}>
            <FormControlLabel
              className={classes.flex}
              control={
                <Checkbox
                  name="agree_vital"
                  color="primary"
                  inputRef={register({
                    required: true,
                  })}
                />
              }
              label="필수 항목에 동의합니다."
            />

            <Button className={classes.flex} color="secondary" ml={3}>
              <u>등록 업체 이용약관</u>
            </Button>
            <Button className={classes.flex} color="secondary" ml={3}>
              <u>개인정보 수집이용 동의</u>
            </Button>
          </Box>

          <FormControlLabel
            className={classes.flex}
            control={<Checkbox name="agree_marketing" color="primary" inputRef={register} />}
            label="마케팅 정보 수신 동의 (선택)"
          />
        </Box>

        <Button variant="contained" color="primary" px={16} py={2} onClick={handleSubmit(handleSignUp)}>
          <Typography fontWeight={"700"}>회원가입 신청</Typography>
        </Button>
      </Box>
    </Container>
  );
};
