import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { price } from "common";
import dayjs from "dayjs";

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
  Tabs,
  Tab,
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

const salesman_member_columns = [
  { field: "user_name", title: "유저명" },
  { field: "user_rank", title: "등급" },
];
const monthly_incentive_columns = [
  { field: "incentive_dt", title: "날짜", render: ({ incentive_dt }) => dayjs.unix(incentive_dt).format("YYYY-MM") },
  {
    field: "total_amount",
    title: "총구매대행액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "incentive_amount",
    title: "인센티브액",
    render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];

const salesman_member_rows = [
  {
    user_no: 3,
    user_name: "김태호",
    user_rank: "골드",
  },
  {
    user_no: 7,
    user_name: "박태호",
    user_rank: "실버",
  },
  {
    user_no: 8,
    user_name: "이태호",
    user_rank: "코끼리",
  },
];
const monthly_incentive_rows = [
  {
    month_no: 1,
    incentive_dt: 1882783984,
    total_amount: 123456000,
    incentive_amount: 126000,
  },
  {
    month_no: 3,
    incentive_dt: 1120973984,
    total_amount: 323456000,
    incentive_amount: 526000,
  },
  {
    month_no: 6,
    incentive_dt: 2092883984,
    total_amount: 223456000,
    incentive_amount: 426000,
  },
];

export const SalesmanDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const history = useHistory();
  const { control, register, reset, handleSubmit } = useForm();

  const [tabStatus, setTabStatus] = useState("member");
  const [salesmanInfo, setUserInfo] = useState();

  async function getSalesmanDetail() {
    reset({
      name: "전지현",
      phone: "01055663322",
      email: "admin@gmail.com",
      status: "2",
    });
    setUserInfo({
      code_no: "81JK3D",
      register_dt: 3333333333,
    });
  }
  async function handleUpdateSalesman(data) {
    console.log("data", data);

    getSalesmanDetail();
  }

  useEffect(() => {
    getSalesmanDetail();
  }, [member_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        영업사원 정보
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
          <TableCell>코드번호</TableCell>
          <TableCell>{salesmanInfo?.code_no}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>등록일자</TableCell>
          <TableCell>{dayjs.unix(salesmanInfo?.register_dt).format("YYYY-MM-DD")}</TableCell>
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
          <TableCell>상태</TableCell>
          <TableCell>
            <Controller
              as={
                <TextField select size="small" variant="outlined">
                  <MenuItem value={"0"}>이용중</MenuItem>
                  <MenuItem value={"1"}>일시정지</MenuItem>
                  <MenuItem value={"2"}>퇴사</MenuItem>
                </TextField>
              }
              control={control}
              name="status"
              defaultValue="0"
            />
          </TableCell>
        </TableRow>
        {/* <TableRow>
          <TableCell>인센티브율</TableCell>
          <TableCell>{salesmanInfo?.accumulate_rate} %</TableCell>
        </TableRow> */}
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
        <Button variant="contained" color="primary" onClick={handleSubmit(handleUpdateSalesman)}>
          수정
        </Button>
      </Box>

      <Tabs value={tabStatus} onChange={(e, v) => setTabStatus(v)}>
        <Tab value="member" label="회원관리" />
        <Tab value="incentive" label="인센티브월별현황" />
      </Tabs>

      <Box my={2}>
        {tabStatus === "member" ? (
          <ColumnTable
            columns={salesman_member_columns}
            data={salesman_member_rows}
            onRowClick={(row) => history.push(`/user/${row.user_no}`)}
          />
        ) : (
          <ColumnTable
            columns={monthly_incentive_columns}
            data={monthly_incentive_rows}
            onRowClick={(row) => history.push(`/salesman/incentive/${row.month_no}`)}
          />
        )}
      </Box>

      <Box position="relative" py={6}>
        <Pagination />
      </Box>
    </Box>
  );
};
