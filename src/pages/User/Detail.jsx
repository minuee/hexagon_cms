import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";

import { price } from "common";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  header_box: {
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",

    width: "25rem",
    height: "13rem",
    background: "#fff",

    border: "solid 1px #ddd",
    borderRadius: "1rem",

    marginRight: theme.spacing(4),
    padding: theme.spacing(3),
  },
  rank_content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& .MuiAvatar-root": {
      marginLeft: theme.spacing(8),
      width: "7rem",
      height: "7rem",
    },
  },
}));

const reward_history_column = [
  {
    field: "accumulate_dt",
    title: "적립일자",
    render: ({ accumulate_dt }) => dayjs.unix(accumulate_dt).format("YYYY.MM.DD"),
  },
  { field: "user_name", title: "유저명" },
  { field: "reward_reason", title: "내역" },
  {
    field: "reward_amount",
    title: "리워드액",
    render: ({ reward_amount }) => `+${price(reward_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const reward_history_row = [
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
  {
    accumulate_dt: 8882229999,
    user_name: "륶인창",
    reward_reason: "친구초대",
    reward_amount: 5555,
  },
];

export const UserDetail = () => {
  const classes = useStyles();
  const { control } = useForm();

  const [userInfo, setUserInfo] = useState({
    rank: "silver",
    rank_text: "실버등급",
    accumulate_rate: "1.5",
    accumulate_amount: 12346777,

    name: "전지현",
    code_no: "81JK3D",
    register_dt: 3333333333,
    phone_no: "01055663322",
    email: "admin@gmail.com",
    authority: 1,

    signup_yn: true,
    salesman_code: "X398D2",
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        유저 정보 및 리워드 상세
      </Typography>

      <Box my={2}>
        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            등급
          </Typography>

          <Box className={classes.rank_content}>
            <Avatar src="/image/rank_silver.png" />
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="700">
                {userInfo?.rank_text || "-"}
              </Typography>
              <Typography>적립률 {userInfo?.accumulate_rate || "-"}% 적용</Typography>
            </Box>
          </Box>
        </Box>

        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            초대 적립금 현황
          </Typography>

          <Typography textAlign="right" variant="h5" fontWeight="700">
            {price(userInfo?.accumulate_amount) || "-"} 원
          </Typography>
        </Box>
      </Box>

      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>이름</TableCell>
          <TableCell>{userInfo?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>코드번호</TableCell>
          <TableCell>{userInfo?.code_no}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>가입승인일자</TableCell>
          <TableCell>{dayjs(userInfo?.register_dt).format("YYYY-MM-DD")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>{userInfo?.phone_no}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이메일</TableCell>
          <TableCell>{userInfo?.email}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>권한</TableCell>
          <TableCell>
            <TextField select size="small" variant="outlined" value={userInfo?.authority}>
              <MenuItem value={"1"}>영업사원</MenuItem>
              <MenuItem value={"2"}>경영자</MenuItem>
              <MenuItem value={"3"}>브로커</MenuItem>
            </TextField>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>등급</TableCell>
          <TableCell>
            <FormControlLabel
              control={<Checkbox name="rank_bronze" color="primary" checked={userInfo?.rank === "bronze"} />}
              label="브론즈"
            />
            <FormControlLabel
              control={<Checkbox name="rank_bronze" color="primary" checked={userInfo?.rank === "silver"} />}
              label="실버"
            />
            <FormControlLabel
              control={<Checkbox name="rank_bronze" color="primary" checked={userInfo?.rank === "gold"} />}
              label="골드"
            />
            <FormControlLabel
              control={<Checkbox name="rank_bronze" color="primary" checked={userInfo?.rank === "platinum"} />}
              label="플래티넘"
            />
          </TableCell>
        </TableRow>
        {userInfo?.signup_yn && (
          <TableRow>
            <TableCell>영업사원 코드</TableCell>
            <TableCell>{userInfo?.salesman_code}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>적립률</TableCell>
          <TableCell>{userInfo?.accumulate_rate} %</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증 첨부</TableCell>
          <TableCell>
            <Dropzone control={control} name="lisence_img" width="90px" ratio={1} />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box
        py={2}
        display="flex"
        // justifyContent="center"
      >
        {userInfo?.signup_yn ? (
          <Button variant="contained" color="primary">
            정보 수정
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            회원가입 승인
          </Button>
        )}
      </Box>

      <Box my={2}>
        <Typography fontWeight="500">리워드 히스토리</Typography>
      </Box>
      <ColumnTable columns={reward_history_column} data={reward_history_row} />
      <Box position="relative" py={6}>
        <Pagination />
      </Box>
    </Box>
  );
};
