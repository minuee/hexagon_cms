import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, makeStyles } from "@material-ui/core";
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

const member_rank_columns = [
  { title: "번호", field: "no", width: 80 },
  { title: "유저명", field: "member_name", width: 160 },
  {
    title: "구매누적액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const AdminHome = () => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);

  const [analisysData, setAnalisysData] = useState();

  async function getAnalisysData() {
    let data = await apiObject.getAnalisysData({});
    setAnalisysData(data);
  }

  useEffect(() => {
    getAnalisysData();
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500}>
        {member?.name}님, 환영합니다
      </Typography>
      <Typography variant="h6" fontWeight={300} textAlign="right">
        {dayjs().format("YYYY-MM-DD")}
      </Typography>

      <Box className={classes.sales_amount}>
        <Typography variant="h6" fontWeight={700}>
          일일 판매액
        </Typography>
        <Typography color="secondary">{dayjs().format("YYYY.MM.DD HH:mm")} 기준</Typography>

        <Box my={2}>
          <Typography variant="h5" textAlign="right">
            {`${price(analisysData?.today_sales?.daily_sales || 0)}원`}
          </Typography>
        </Box>
      </Box>

      <Box display="flex">
        <Box className={classes.column_table} mr={6}>
          <Typography variant="h6" fontWeight={700}>
            유저 구매누적액 현황
          </Typography>
          <Typography color="secondary">{dayjs().format("YYYY.MM.DD HH:mm 기준 (순상품금액기준)")}</Typography>

          <Box my={2}>
            <ColumnTable
              columns={member_rank_columns}
              data={analisysData?.rank_data}
              onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
            />
          </Box>

          <Button variant="text" onClick={() => history.push("/member")}>
            <Typography>더보기</Typography>
            <KeyboardArrowRight />
          </Button>
        </Box>

        {/* <Box className={classes.column_table}>
          <Typography variant="h6" fontWeight={700}>
            영업사원 인센티브 통계
          </Typography>
          <Typography color="secondary">{dayjs().format("YYYY.MM.DD HH:mm")} 기준</Typography>

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
        </Box> */}
      </Box>
    </Box>
  );
};
