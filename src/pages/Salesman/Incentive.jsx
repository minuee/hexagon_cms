import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { price } from "common";
import dayjs from "dayjs";

import { Box, makeStyles } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({}));

const incentive_list_columns = [
  { field: "purchase_dt", title: "날짜", render: ({ incentive_dt }) => dayjs.unix(incentive_dt).format("YYYY-MM-DD") },
  { field: "total_amount", title: "총구매대행액", render: ({ total_amount }) => `${price(total_amount)}원` },
  { field: "incentive_amount", title: "인센티브액", render: ({ incentive_amount }) => `${price(incentive_amount)}원` },
];
const incentive_list_rows = [
  {
    purchase_no: 1,
    incentive_dt: 1882783984,
    total_amount: 123456000,
    incentive_amount: 126000,
  },
  {
    purchase_no: 3,
    incentive_dt: 1120973984,
    total_amount: 323456000,
    incentive_amount: 526000,
  },
  {
    purchase_no: 6,
    incentive_dt: 2092883984,
    total_amount: 223456000,
    incentive_amount: 426000,
  },
];

export const SalesmanIncentive = () => {
  const history = useHistory();

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        {2029}년 {1}월 인센티브 상세
      </Typography>

      <Box mt={4} />

      <ColumnTable
        columns={incentive_list_columns}
        data={incentive_list_rows}
        onRowClick={(row) => history.push(`/purchase/${row.purchase_no}`)}
      />
      <Box position="relative" py={6}>
        <Pagination />
      </Box>
    </Box>
  );
};
