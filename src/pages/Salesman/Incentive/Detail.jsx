import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiObject } from "api";
import { price } from "common";
import dayjs from "dayjs";

import { Box } from "@material-ui/core";
import { HelpOutlineOutlined } from "@material-ui/icons";
import { Typography } from "components/materialui";
import { ColumnTable } from "components";

const incentive_list_columns = [
  { title: "날짜", render: ({ order_reg_dt }) => dayjs.unix(order_reg_dt).format("YYYY-MM-DD"), width: 160 },
  { title: "주문자", field: "member_name", width: 160 },
  { title: "주문번호", field: "order_no", width: 240 },
  {
    title: "총구매대행액",
    render: ({ discount_price, total_price }) =>
      discount_price > 0 ? `${price(discount_price)}원` : `${price(total_price)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브대상금액",
    render: ({ event_limit_price, discount_price, total_price }) =>
      event_limit_price > 0 ? "0원" : discount_price > 0 ? `${price(discount_price)}원` : `${price(total_price)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const IncentiveDetail = () => {
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);
  const { sales_month } = useParams();

  const [incentiveData, setIncentiveData] = useState();

  async function getIncentiveList() {
    if (!member.member_pk) return;

    let data = await apiObject.getSalesmanMonthlyIncentiveList({ member_pk: member.member_pk, sales_month });
    setIncentiveData(data);
  }

  useEffect(() => {
    getIncentiveList();
  }, [member, sales_month]);

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
        onRowClick={(row) => history.push(`/incentive/${sales_month}/${row.order_pk}`)}
      />

      <Box px={2} py={6} display="flex" alignItems="center">
        <Box display="inline-block">
          <Box mb={1} display="flex" alignItems="center">
            <HelpOutlineOutlined />
            <Box mr={1} />
            <Typography display="inline">월간 누적금액 기준산정</Typography>
          </Box>
          <Typography>2천 이상일 경우 총금액의 1%, 3천 이상일 경우 총금액의 1.5%로 인센티브액이 정산됩니다.</Typography>
          <Typography>(특가한정상품은 인센티브 대상에서 제외됩니다)</Typography>
        </Box>
      </Box>
    </Box>
  );
};
