import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { makeStyles, Box, Container, TextField, FormControlLabel, Checkbox, InputLabel } from "@material-ui/core";
import { Label } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ImageBox } from "components";

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

  async function handleSignUp(data) {
    console.log(data);

    alert("회원가입 신청 완료!");

    history.push("/");
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Box mt={16} mb={8} className={classes.wrapper}>
        <ImageBox src="/image/logo_color.png" width="20rem" height="7rem" mb={4} />
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
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상 영문+숫자+특수문자)"
            inputRef={register({
              required: true,
              pattern: /^\S{8,}$/,
            })}
            error={!!errors?.password}
          />
          <TextField
            className={classes.input}
            variant="outlined"
            type="password"
            name="password_confirm"
            placeholder="비밀번호 확인"
            inputRef={register({
              required: true,
              validate: (v) => v == watch("password"),
            })}
            error={watch("password") !== watch("password_confirm")}
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

          {/* <InputLabel
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
          /> */}

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
            name="phone"
            placeholder="휴대폰번호 (-를 빼고 입력)"
            inputRef={register({
              required: true,
              pattern: /^\d{10,11}$/,
            })}
            error={!!errors?.phone}
          />
        </>

        {/* terms */}
        <Box my={5} ml={1}>
          <Box mb={1}>
            <FormControlLabel
              className={classes.flex}
              control={<Checkbox color="primary" />}
              label="전체 약관에 동의합니다"
              onChange={(e) => {
                setValue("agree_vital", e.target.checked);
                setValue("agree_marketing", e.target.checked);
              }}
            />
          </Box>
          <Box mb={2}>
            <Controller
              render={({ value, onChange }) => (
                <FormControlLabel
                  className={classes.flex}
                  control={<Checkbox color="primary" />}
                  label="필수 항목에 동의합니다."
                  onChange={(e) => onChange(e.target.checked)}
                  checked={value}
                />
              )}
              name="agree_vital"
              control={control}
              defaultValue={false}
              rules={{ required: true }}
            />

            <Button className={classes.flex} color="secondary" ml={3}>
              <u>등록 업체 이용약관</u>
            </Button>
            <Button className={classes.flex} color="secondary" ml={3}>
              <u>개인정보 수집이용 동의</u>
            </Button>
          </Box>

          <Controller
            render={({ value, onChange }) => (
              <FormControlLabel
                className={classes.flex}
                control={<Checkbox color="primary" />}
                label="마케팅 정보 수신 동의 (선택)"
                onChange={(e) => onChange(e.target.checked)}
                checked={value}
              />
            )}
            name="agree_marketing"
            control={control}
            defaultValue={false}
          />
        </Box>

        <Button variant="contained" color="primary" px={16} py={2} onClick={handleSubmit(handleSignUp)}>
          <Typography fontWeight={"700"}>회원가입 신청</Typography>
        </Button>
      </Box>
    </Container>
  );
};
