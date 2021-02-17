import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { price } from "common";

import { Grid, Box, makeStyles } from "@material-ui/core";
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

    // "& > :last-child": {
    //   alignSelf: "flex-end",
    // },
  },
}));

const user_purchase_columns = [
  { title: "번호", field: "user_no", width: 80 },
  { title: "회원명", field: "user_name", width: 100 },
  {
    title: "구매액",
    render: ({ reward_amount }) => `${price(reward_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const user_purchase_rows = [
  {
    user_no: 1,
    user_name: "김갑순",
    reward_amount: 527908720000,
  },
  {
    user_no: 2,
    user_name: "정자룡",
    reward_amount: 278979843900,
  },
  {
    user_no: 3,
    user_name: "김세란",
    reward_amount: 109823787490,
  },
  {
    user_no: 4,
    user_name: "곽태호",
    reward_amount: 80982092000,
  },
  {
    user_no: 5,
    user_name: "황지령",
    reward_amount: 70981274450,
  },
];

export const SalesmanHome = () => {
  const classes = useStyles();
  const history = useHistory();

  const [userPurchaseData, setUserPurchaseData] = useState();

  useEffect(() => {
    setUserPurchaseData(user_purchase_rows);
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500}>
        {"영업사원"}님, 환영합니다
      </Typography>
      <Typography variant="h6" fontWeight={300} textAlign="right">
        {`[${"수요일"}]`}
      </Typography>
      <Typography variant="h6" fontWeight={300} textAlign="right">
        {dayjs().format("YYYY-MM-DD")}
      </Typography>

      <Box className={classes.sales_amount}>
        <Typography variant="h6" fontWeight={700}>
          일일 구매액
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
            회원 구매 통계
          </Typography>
          <Typography color="secondary">{dayjs().format("YYYY.MM.DD hh:mm")} 기준</Typography>

          <Box my={2}>
            <ColumnTable
              columns={user_purchase_columns}
              data={userPurchaseData}
              // onRowClick={(row) => history.push(`/user/${row.user_no}`)}
            />
          </Box>

          {/* <Button onClick={() => history.push("/user")}>
            <Typography>더보기</Typography>
            <KeyboardArrowRight />
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};
