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
    title: "결제방식",
    render: ({ settle_type,settle_type_name }) => settle_type_name,
    width: 120,
  },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "주문상태",
    render: ({ order_status,order_status_name,settle_type,is_refund_point }) => (
      <>
        <p>{order_status_name}</p>
        {(settle_type == 'vbank' && order_status == 'CANCEL_A' ) && <span style={{color:'red'}}>{`(환불요청중)`}</span>}
        {(is_refund_point == true && order_status == 'CANCEL_B' ) && <span style={{color:'blue'}}>{`(미출고처리)`}</span>}
      </>
    ),
    width: 150,
    cellStyle: { textAlign: "center" },
  },
  
  /* { title: "주문상태", field: "order_status_name", width: 150 }, */
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
  {
    label: "주문상태순",
    value: "ryuin",
  },
];
const order_status_list = [
  {
    label: "주문상태",
    value: "",
  },
  {
    label: "입금대기",
    value: "WAIT",
  },
  {
    label: "입금완료",
    value: "INCOME",
  },
  {
    label: "배송준비중",
    value: "READY",
  },
  {
    label: "출고완료",
    value: "TRANSING",
  },
  {
    label: "배송완료",
    value: "TRANSOK",
  },
  {
    label: "주문취소",
    value: "CANCEL_A",
  },
  {
    label: "주문취소완료",
    value: "CANCEL_B",
  },
  {
    label: "교환요청",
    value: "RETURN",
  },
];

export const OrderList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, SearchBox, FilterBox, FilterBox2, TermSearchBox } = useQuery(location);

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
        <Box>
          <Typography display="inline" variant="h5" fontWeight="500">
            주문내역
          </Typography>

          <FilterBox2 ml={2} item_list={order_status_list} filter_item="order_status" />
        </Box>

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
