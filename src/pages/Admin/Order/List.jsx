import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiObject } from "api";
import { price } from "common";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { DescriptionOutlined, Search, EventNote } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";

import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, SearchBox } from "components";

const useStyles = makeStyles((theme) => ({
  datepicker: {
    display: "inline-flex",
    alignItems: "center",

    "& > .MuiFormControl-root": {
      background: "#fff",
      width: "10rem",
    },
  },

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
  { title: "구매번호", field: "order_code", width: 160 },
  {
    title: "구매일자",
    render: ({ order_dt }) => dayjs.unix(order_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  { title: "유저명", field: "user_name", width: 100 },
  {
    title: "구매액",
    render: ({ order_price }) => `${price(order_price)}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "주문상태", field: "order_status", width: 100 },
];

export const OrderList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [orderList, setOrderList] = useState();

  async function getOrderList() {
    let data = await apiObject.getOrderList({ ...query });
    setOrderList(data);
  }

  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/order?" + qs.stringify(query));
  }

  useEffect(() => {
    getOrderList();
  }, [query.page, query.search_word, query.start_dt, query.end_dt]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          주문내역
        </Typography>

        <Box className={classes.datepicker}>
          <DatePicker
            value={query.start_dt ? dayjs.unix(query.start_dt) : null}
            onChange={(d) => handleQueryChange("start_dt", d?.unix())}
            format="YYYY-MM-DD"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EventNote />
                </InputAdornment>
              ),
            }}
          />
          <Box mx={1} fontWeight="700">
            -
          </Box>
          <DatePicker
            value={query.end_dt ? dayjs.unix(query.end_dt) : null}
            onChange={(d) => handleQueryChange("end_dt", d?.unix())}
            format="YYYY-MM-DD"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EventNote />
                </InputAdornment>
              ),
            }}
          />
          <Button ml={1} color="primary">
            검색
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={order_list_columns}
          data={orderList}
          onRowClick={(row) => history.push(`/order/${row.order_no}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={query.page} setPage={handleQueryChange} />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
