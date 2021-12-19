import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable } from "components";

const useStyles = makeStyles((theme) => ({
  header_buttons: {
    display: "inline-flex",
    alignItems: "center",

    "& > *": {
      marginleft: theme.spacing(1),
    },
  },
  table_footer: {
    position: "relative",
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const header_button_list = [
  {
    label: "미사용",
    value: "ing",
  },
  {
    label: "사용완료",
    value: "old",
  },
];
const coupon_list_columns = [
  { title: "번호", field: "no", width: 80 },
  { title: "사용자", field: "member_name" },
  { title: "금액", render: ({ coupon_type }) => price(coupon_type), width: 160, cellStyle: { textAlign: "right" } },
  {
    title: "발행일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  {
    title: "만료일자",
    render: ({ end_dt }) => dayjs.unix(end_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  // { title: "사용여부", render: ({ use_yn }) => (use_yn ? "Y" : "N"), width: 120 },
];

export const CouponList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, FilterBox } = useQuery(location);

  const [couponList, setCouponList] = useState();

  async function getCouponList(query) {
    let data;

    if (query.filter_item === "old") {
      data = await apiObject.getPassCouponList({ ...query });
    } else {
      data = await apiObject.getValidCouponList({ ...query });
    }

    setCouponList(data);
  }

  useEffect(() => {
    getDataFunction(getCouponList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          쿠폰 목록
        </Typography>

        <Box className={classes.header_buttons}>
          <FilterBox type="filter" button_list={header_button_list} default_item="ing" />

          <Button color="primary" ml={3} onClick={() => history.push(`/coupon/regist`)}>
            등록
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={coupon_list_columns}
          data={couponList}
          onRowClick={(row) => history.push(`/coupon/${row.coupon_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Pagination total={couponList?.[0]?.total} />
      </Grid>
    </Box>
  );
};
