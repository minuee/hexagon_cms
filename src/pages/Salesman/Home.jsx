import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, makeStyles } from "@material-ui/core";
import { Typography } from "components/materialui";
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
  { title: "번호", field: "no", width: 80 },
  { title: "회원명", field: "member_name", width: 100 },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const SalesmanHome = () => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);

  const [dailySales, setDailySales] = useState("");
  const [userPurchaseList, setUserPurchaseList] = useState();

  async function getAnalisysData() {
    let data = await apiObject.getSalesmanAnalisysData({
      special_code: member.special_code,
    });

    setUserPurchaseList(data.rank_data);
    setDailySales(data.today_sales?.daily_sales);
  }

  useEffect(() => {
    getAnalisysData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500}>
        {member.name}님, 환영합니다
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
            <span>{price(dailySales)}</span> 원
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
              data={userPurchaseList}
              // onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
            />
          </Box>

          {/* <Button onClick={() => history.push("/member")}>
            <Typography>더보기</Typography>
            <KeyboardArrowRight />
          </Button> */}
        </Box>
      </Box>
    </Box>
  );
};
