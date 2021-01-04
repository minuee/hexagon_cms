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

  user_reward: {
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
  { field: "reward_no", title: "번호", width: 80 },
  { field: "user_name", title: "유저명" },
  { field: "reward_amount", title: "리워드액" },
];
const user_reward_rows = [
  {
    reward_no: 1,
    user_name: "륶인창",
    reward_amount: 1111111111,
  },
  {
    reward_no: 1,
    user_name: "륶인창",
    reward_amount: 1111111111,
  },
  {
    reward_no: 1,
    user_name: "륶인창",
    reward_amount: 1111111111,
  },
  {
    reward_no: 1,
    user_name: "륶인창",
    reward_amount: 1111111111,
  },
];

export const Home = () => {
  const classes = useStyles();

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

      <Box className={classes.user_reward}>
        <Typography variant="h6" fontWeight={700}>
          유저 리워드
        </Typography>
        <Typography color="secondary">{dayjs().format("YYYY.MM.DD hh:mm")} 기준</Typography>

        <Box my={2}>
          <ColumnTable columns={user_reward_columns} data={userRewardData} />
        </Box>

        <Button>
          <Typography>더보기</Typography>
          <KeyboardArrowRight />
        </Button>
      </Box>
    </Box>
  );
};
