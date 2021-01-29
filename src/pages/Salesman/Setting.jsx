import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { price } from "common";
import qs from "query-string";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  Checkbox,
  FormControlLabel,
  TableRow,
  TableCell,
  Tab,
  Tabs,
} from "@material-ui/core";
import { EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  password_input: {
    display: "flex",
    width: theme.spacing(40),
    marginTop: theme.spacing(1),
  },
}));

export const Setting = ({ location }) => {
  const history = useHistory();
  const query = qs.parse(location.search);

  function handleTabChange(e, v) {
    query.tab = v;
    history.push("/setting?" + qs.stringify(query));
  }

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          설정
        </Typography>
      </Box>

      <Box my={2}>
        <Tabs value={query.tab || "info"} onChange={handleTabChange}>
          <Tab value="info" label="정보 수정" />
          <Tab value="password" label="비밀번호 수정" />
        </Tabs>
      </Box>

      <Box>{query.tab === "password" ? <ModifyPassword /> : <ModifyInfo />}</Box>
    </Box>
  );
};

const ModifyInfo = () => {
  const { register, reset, handleSubmit, errors } = useForm();

  async function getInfo() {
    reset({
      name: "전지현",
      id: "jhlove1030",
      email: "jhlove1030@naver.com",
      phone: "01088716232",
    });
  }
  async function modifyInfo(form) {
    if (!window.confirm("입력한 정보로 수정하시겠습니까?")) return;

    console.log(form);
  }

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Box>
      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>이름</TableCell>
          <TableCell>
            <Typography>전지현</Typography>
            {/* <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="name"
              placeholder="이름을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors.name}
            /> */}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>아이디</TableCell>
          <TableCell>
            <Typography>jhlove1030</Typography>
            {/* <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="id"
              placeholder="아이디를 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors.id}
            /> */}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>이메일</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="email"
              placeholder="이메일을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors.email}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="phone"
              placeholder="휴대폰 번호를 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors.phone}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit(modifyInfo)}>
          수정
        </Button>
      </Box>
    </Box>
  );
};

const ModifyPassword = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError } = useForm();

  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  async function checkCurPassword(form) {
    console.log(form);

    if (form.cur_password === "yes1234") {
      setIsPasswordConfirmed(true);
    } else {
      setError("cur_password", {
        type: "manual",
        message: "비밀번호가 틀립니다",
      });
    }
  }
  async function modifyPassword(form) {
    console.log(form);

    if (form.new_password_1 === form.new_password_2) {
      alert("비밀번호 변경이 완료되었습니다!");
      setIsPasswordConfirmed(false);
    } else {
      setError("new_password_1", {});
      setError("new_password_2", {});
    }
  }

  return (
    <Box p={2} bgcolor="#fff">
      {!isPasswordConfirmed && (
        <Box>
          <Box mb={2}>
            <Typography>보안을 위해 현재 비밀번호를 입력해주세요 (yes1234)</Typography>
          </Box>
          <TextField
            className={classes.password_input}
            variant="outlined"
            type="password"
            name="cur_password"
            placeholder="현재 비밀번호를 입력해주세요"
            inputRef={register({ required: true })}
            error={!!errors.cur_password}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(checkCurPassword)()}
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit(checkCurPassword)}>
              확인
            </Button>
          </Box>
        </Box>
      )}

      {isPasswordConfirmed && (
        <Box>
          <Box mb={2}>
            <Typography>변경할 비밀번호를 입력해주세요</Typography>
          </Box>
          <TextField
            className={classes.password_input}
            variant="outlined"
            type="password"
            name="new_password_1"
            placeholder="변경할 비밀번호를 입력해주세요"
            inputRef={register({ required: true })}
            error={!!errors.new_password_1}
          />
          <TextField
            className={classes.password_input}
            variant="outlined"
            type="password"
            name="new_password_2"
            placeholder="변경할 비밀번호를 다시 입력해주세요"
            inputRef={register({ required: true })}
            error={!!errors.new_password_2}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit(modifyPassword)()}
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" onClick={handleSubmit(modifyPassword)}>
              변경
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};
