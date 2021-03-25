import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography } from "components/materialui";
import { ColumnTable, ExcelExportButton } from "components";

const useStyles = makeStyles((theme) => ({
  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const order_list_columns = [
  { title: "번호", field: "no", width: 80 },
  { title: "구매번호", field: "order_no", width: 240 },
  {
    title: "구매일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  { title: "회원명", field: "member_name", width: 160 },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "주문상태", field: "order_status_name", width: 100 },
];
const header_button_list = [
  {
    label: "주문일자순",
    value: "reg_dt",
  },
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "구매액순",
    value: "order",
  },
];

export const OrderList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, SearchBox, FilterBox, TermSearchBox } = useQuery(location);

  const [orderList, setOrderList] = useState();

  async function getOrderList(query) {
    let data = await apiObject.getOrderList({ ...query });
    setOrderList(data);
  }

  useEffect(() => {
    getDataFunction(getOrderList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          주문내역
        </Typography>

        <Box>
          <FilterBox mr={3} type="sort" button_list={header_button_list} default_item="reg_dt" />

          <TermSearchBox />
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={order_list_columns}
          data={orderList}
          onRowClick={(row) => history.push(`/order/${row.order_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <ExcelExportButton path="order" />

        <Pagination total={orderList?.[0]?.total} />

        <SearchBox />
      </Grid>
    </Box>
  );
};
