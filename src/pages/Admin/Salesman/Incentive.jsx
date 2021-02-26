import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { apiObject } from "api";
import { price } from "common";
import dayjs from "dayjs";

import { Box, makeStyles } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({}));

const incentive_list_columns = [
  { title: "날짜", render: ({ order_reg_dt }) => dayjs.unix(order_reg_dt).format("YYYY-MM-DD"), width: 160 },
  { title: "주문자", field: "member_name", width: 160 },
  { title: "주문번호", field: "order_no", width: 240 },
  {
    title: "총구매대행액",
    render: ({ total_price }) => `${price(total_price)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "incentive_amount",
    title: "인센티브대상금액",
    render: ({ event_limit_price, total_price }) => (event_limit_price > 0 ? "0원" : `${price(total_price)}원`),
    cellStyle: { textAlign: "right" },
  },
];

export const SalesmanIncentive = () => {
  const history = useHistory();
  const { member_pk, sales_month } = useParams();

  const [incentiveData, setIncentiveData] = useState();

  async function getIncentiveList() {
    let data = await apiObject.getSalesmanMonthlyIncentiveList({ member_pk, sales_month });
    setIncentiveData(data);
  }

  useEffect(() => {
    getIncentiveList();
  }, [member_pk, sales_month]);

  return (
    <Box>
      <Box mb={2}>
        <Typography variant="h5" fontWeight="500">
          {sales_month.substring(0, 4)}년 {sales_month.substring(5)}월 인센티브 상세
        </Typography>

        <Box mt={2}>
          <Typography>구매액: {price(incentiveData?.total_amount)}원</Typography>
          <Typography>인센티브액: {price(incentiveData?.total_incentive)}원</Typography>
        </Box>
      </Box>

      <ColumnTable
        columns={incentive_list_columns}
        data={incentiveData?.order_data}
        onRowClick={(row) => history.push(`/order/${row.order_pk}`)}
      />
      <Box position="relative" py={6}>
        {/* <Pagination /> */}
      </Box>
    </Box>
  );
};
