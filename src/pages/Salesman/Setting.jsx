import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { apiObject } from "api";
import { decrypt } from "common";
import { useQuery } from "hooks";
import jwt from "jsonwebtoken";

import { Box, makeStyles, TextField, TableRow, TableCell, Tab, Tabs } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

const useStyles = makeStyles((theme) => ({
  password_input: {
    display: "flex",
    width: theme.spacing(40),
    marginTop: theme.spacing(1),
  },
}));

export const Setting = ({ location }) => {
  const history = useHistory();
  const { query, updateQuery } = useQuery(location);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          설정
        </Typography>
      </Box>

      <Box my={2}>
        <Tabs value={query.tab || "info"} onChange={(e, v) => updateQuery({ tab: v })}>
          <Tab value="info" label="정보 수정" />
          <Tab value="password" label="비밀번호 수정" />
        </Tabs>
      </Box>

      <Box>{query.tab === "password" ? <ModifyPassword /> : <ModifyInfo />}</Box>
    </Box>
  );
};

const ModifyInfo = () => {
  const { member } = useSelector((state) => state.reducer);
  const { register, reset, handleSubmit, errors } = useForm();

  async function modifyInfo(form) {
    if (!window.confirm("입력한 내용으로 정보를 수정하시겠습니까?")) return;

    await apiObject.modifySalesman({
      member_pk: member.member_pk,
      name: member.name,
      is_retired: false,
      ...form,
    });
  }

  useEffect(() => {
    reset({
      email: decrypt(member?.email),
      phone: decrypt(member?.phone),
    });
  }, [member]);

  return (
    <Box>
      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>이름</TableCell>
          <TableCell>{member?.name}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>아이디</TableCell>
          <TableCell>{member?.user_id}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>이메일</TableCell>
          <TableCell>
            <TextField
              size="small"
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
        <Button color="primary" onClick={handleSubmit(modifyInfo)}>
          수정
        </Button>
      </Box>
    </Box>
  );
};

const ModifyPassword = () => {
  const classes = useStyles();
  const { register, handleSubmit, reset, errors, setError } = useForm();

  async function modifyPassword(form) {
    if (form.new_password_1 !== form.new_password_2) {
      setError("new_password_1", {});
      setError("new_password_2", {
        type: "validate",
        message: "새로운 비밀번호가 일치하지 않습니다",
      });
      return;
    }

    if (!window.confirm("입력한 정보로 비밀번호를 수정하시겠습니까?")) return;

    let member_pk = jwt.decode(localStorage.getItem("hexagon_cms_token")).member_pk;
    let resp = await apiObject.modifySalesmanPassword({
      member_pk,
      nowPassword: form.cur_password,
      newPassword: form.new_password_1,
    });

    if (resp.data?.code === "1002") {
      setError("cur_password", {
        type: "validate",
        message: "현재 비밀번호가 올바르지 않습니다",
      });
    } else {
      alert("비밀번호가 수정되었습니다");
      reset({
        cur_password: "",
        new_password_1: "",
        new_password_2: "",
      });
    }
  }

  return (
    <Box p={2} width="70%" bgcolor="#fff">
      <Box>
        <Box mb={1}>
          <Typography>현재 비밀번호</Typography>
        </Box>
        <TextField
          className={classes.password_input}
          type="password"
          name="cur_password"
          placeholder="현재 비밀번호를 입력해주세요"
          inputRef={register({ required: "현재 비밀번호를 입력해주세요" })}
          error={!!errors.cur_password}
        />
        <Typography variant="subtitle1">{errors.cur_password?.message}</Typography>
      </Box>

      <Box mt={4}>
        <Box mb={1}>
          <Typography>변경할 비밀번호</Typography>
        </Box>
        <TextField
          className={classes.password_input}
          type="password"
          name="new_password_1"
          placeholder="변경할 비밀번호를 입력해주세요"
          inputRef={register({ required: true })}
          error={!!errors.new_password_1}
        />
        <TextField
          className={classes.password_input}
          type="password"
          name="new_password_2"
          placeholder="변경할 비밀번호를 다시 입력해주세요"
          inputRef={register({ required: "변경할 비밀번호를 입력해주세요" })}
          error={!!errors.new_password_2}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(modifyPassword)()}
        />
        <Typography variant="subtitle1">{errors.new_password_2?.message}</Typography>
      </Box>

      <Box mt={3}>
        <Button color="primary" onClick={handleSubmit(modifyPassword)}>
          변경
        </Button>
      </Box>
    </Box>
  );
};
