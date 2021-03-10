import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiObject } from "api";
import { price } from "common";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, SearchBox, TermSearchBox, ExcelExportButton } from "components";

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
  { title: "유저명", field: "member_name", width: 160 },
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
const excel_columns = [
  { label: "번호", value: "no" },
  { label: "구매번호", value: "order_no" },
  {
    label: "구매일자",
    value: "reg_dt",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
  },
  { label: "유저명", value: "member_name" },
  {
    label: "구매액",
    value: "total_amount",
    // render: ({ total_amount }) => `${price(total_amount)}원`,
  },
  { label: "주문상태", value: "order_status_name" },
];

export const MemberOrderList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);
  const query = qs.parse(location.search);

  const [orderList, setOrderList] = useState();

  async function getOrderList() {
    if (!member.special_code) return;

    let data = await apiObject.getOrderList({ ...query, special_code: member.special_code });
    setOrderList(data);
  }

  function handleQueryChange(q, v) {
    if (q == "sort_item") {
      if (v === (query[q] || "reg_dt")) {
        query.sort_type = query?.sort_type === "ASC" ? "DESC" : "ASC";
      } else {
        query.sort_type = "DESC";
      }
    }
    if (q !== "page") {
      query.page = 1;
    }

    if (q === "term") {
      Object.assign(query, v);
    } else {
      query[q] = v;
    }
    history.push("/order?" + qs.stringify(query));
  }

  useEffect(() => {
    getOrderList();
  }, [member, query.page, query.search_word, query.term_start, query.term_end, query.sort_item, query.sort_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          회원주문내역
        </Typography>

        <Box>
          <Box display="inline-block" mr={3}>
            {header_button_list.map((item, index) => {
              let is_cur = item.value === (query.sort_item || "reg_dt");
              return (
                <Button variant="text" onClick={() => handleQueryChange("sort_item", item.value)} key={index}>
                  <Typography fontWeight={is_cur ? "700" : undefined}>{item.label}</Typography>
                  {is_cur && <>{query.sort_type === "ASC" ? <ArrowDropUp /> : <ArrowDropDown />}</>}
                </Button>
              );
            })}
          </Box>

          <TermSearchBox term_start={query.term_start} term_end={query.term_end} onTermSearch={handleQueryChange} />
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
        <ExcelExportButton data={orderList} columns={excel_columns} path="Order" />

        <Pagination page={query.page} setPage={handleQueryChange} count={Math.ceil(+orderList?.[0]?.total / 10)} />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
