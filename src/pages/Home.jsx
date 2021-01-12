import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { price } from "common";

import { Grid, Box, Avatar, makeStyles } from "@material-ui/core";
import { KeyboardArrowRight } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable } from "components";

const useStyles = makeStyles((theme) => ({
  sales_amount: {
    width: "20rem",
    background: "#fff",

    marginTop: theme.spacing(4),
    padding: theme.spacing(2),

    "& span": {
      color: theme.palette.primary.main,
      fontWeight: "500",
    },
  },

  column_table: {
    display: "flex",
    flexDirection: "column",

    width: "40rem",
    background: "#fff",

    marginTop: theme.spacing(4),
    padding: theme.spacing(2),

    "& > :last-child": {
      alignSelf: "flex-end",
    },
  },
}));

const user_reward_columns = [
  { field: "user_no", title: "번호", width: 80 },
  { field: "user_name", title: "유저명" },
  {
    field: "reward_amount",
    title: "리워드액",
    render: ({ reward_amount }) => `${price(reward_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const user_reward_rows = [
  {
    user_no: 1,
    user_name: "황지은",
    reward_amount: 1111111111,
  },
  {
    user_no: 2,
    user_name: "유지은",
    reward_amount: 1111111111,
  },
  {
    user_no: 3,
    user_name: "오지은",
    reward_amount: 1111111111,
  },
  {
    user_no: 4,
    user_name: "이지은",
    reward_amount: 1111111111,
  },
];

const salesman_incentive_columns = [
  { field: "salesman_no", title: "번호", width: 80 },
  { field: "salesman_name", title: "영업사원명" },
  {
    field: "incentive_amount",
    title: "인센티브액",
    render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const salesman_incentive_rows = [
  {
    salesman_no: 1,
    salesman_name: "전지현",
    incentive_amount: 1111111111,
  },
  {
    salesman_no: 2,
    salesman_name: "이지현",
    incentive_amount: 1111111111,
  },
  {
    salesman_no: 3,
    salesman_name: "박지현",
    incentive_amount: 1111111111,
  },
  {
    salesman_no: 4,
    salesman_name: "김지현",
    incentive_amount: 1111111111,
  },
];

export const Home = () => {
  const classes = useStyles();
  const history = useHistory();

  const [userRewardData, setUserRewardData] = useState();

  useEffect(() => {
    setUserRewardData(user_reward_rows);
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500}>
        {"관리자"}님, 환영합니다
      </Typography>
      <Typography variant="h6" fontWeight={300} textAlign="right">
        {`[${"수요일"}]`}
      </Typography>
      <Typography variant="h6" fontWeight={300} textAlign="right">
        {dayjs().format("YYYY-MM-DD")}
      </Typography>

      <Box className={classes.sales_amount}>
        <Typography variant="h6" fontWeight={700}>
          일일 판매액
        </Typography>
        <Typography color="secondary">{dayjs().format("YYYY.MM.DD hh:mm")} 기준</Typography>

        <Box my={2}>
          <Typography variant="h5" textAlign="right">
            <span>{price(2122332)}</span> 원
          </Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box className={classes.column_table} mr={6}>
          <Typography variant="h6" fontWeight={700}>
            유저 리워드 통계
          </Typography>
          <Typography color="secondary">{dayjs().format("YYYY.MM.DD hh:mm")} 기준</Typography>

          <Box my={2}>
            <ColumnTable
              columns={user_reward_columns}
              data={userRewardData}
              onRowClick={(row) => history.push(`/user/${row.user_no}`)}
            />
          </Box>

          <Button onClick={() => history.push("/user")}>
            <Typography>더보기</Typography>
            <KeyboardArrowRight />
          </Button>
        </Box>

        <Box className={classes.column_table}>
          <Typography variant="h6" fontWeight={700}>
            영업사원 인센티브 통계
          </Typography>
          <Typography color="secondary">{dayjs().format("YYYY.MM.DD hh:mm")} 기준</Typography>

          <Box my={2}>
            <ColumnTable
              columns={salesman_incentive_columns}
              data={salesman_incentive_rows}
              onRowClick={(row) => history.push(`/salesman/${row.salesman_no}`)}
            />
          </Box>

          <Button onClick={() => history.push("/salesman")}>
            <Typography>더보기</Typography>
            <KeyboardArrowRight />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
