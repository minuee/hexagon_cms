import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { price } from "common";
import dayjs from "dayjs";

import { Box, makeStyles, TextField, TableRow, TableCell } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

export const SalesmanRegister = () => {
  const history = useHistory();
  const { register, handleSubmit } = useForm();

  function handleRegister(data) {
    console.log("register", data);
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        영업사원 등록
      </Typography>

      <Box mt={4} />

      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>이름</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="name"
              placeholder="이름을 입력해주세요"
              inputRef={register({ required: true })}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>아이디</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              name="id"
              placeholder="아이디를 입력해주세요"
              inputRef={register({ required: true })}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>비밀번호</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              type="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              inputRef={register({ required: true })}
            />
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
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>전화번호</TableCell>
          <TableCell>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              type="number"
              name="phone_no"
              placeholder="전화번호를 입력해주세요"
              inputRef={register({ required: true })}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>영업사원코드</TableCell>
          <TableCell>자동생성</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3}>
        <Button variant="contained" mr={2} onClick={() => history.push("/salesman")}>
          목록
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit(handleRegister)}>
          등록
        </Button>
      </Box>
    </Box>
  );
};
