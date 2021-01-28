import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import dayjs from "dayjs";
import { price } from "common";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { DescriptionOutlined, Search, EventNote } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";

import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

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

const purchase_list_columns = [
  { title: "번호", field: "purchase_no", width: 80 },
  { title: "구매번호", field: "purchase_code", width: 160 },
  {
    title: "구매일자",
    render: ({ purchase_dt }) => dayjs.unix(purchase_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  { title: "유저명", field: "user_name", width: 100 },
  {
    title: "구매액",
    render: ({ purchase_price }) => `${price(purchase_price)}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "주문상태", field: "order_status", width: 100 },
];
const purchase_list_rows = [
  {
    purchase_no: 1,
    purchase_code: "20200506-D5446",
    purchase_dt: 3333333333,
    user_name: "전지현",
    purchase_price: 1234567,
    order_status: "배송중",
  },
];

export const PurchaseList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [userList, setUserList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
    search_start_dt: null,
    search_end_dt: null,
  });

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    console.log("listContext", listContext);
  }, [listContext]);

  useEffect(() => {
    setUserList(purchase_list_rows);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          구매내역
        </Typography>

        <Box className={classes.datepicker}>
          <DatePicker
            value={listContext?.search_start_dt}
            onChange={(date) => handleContextChange("search_start_dt", date)}
            format="YYYY-MM-DD"
            inputVariant="outlined"
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
            value={listContext?.search_end_dt}
            onChange={(date) => handleContextChange("search_end_dt", date)}
            format="YYYY-MM-DD"
            inputVariant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EventNote />
                </InputAdornment>
              ),
            }}
          />
          <Button variant="contained" ml={1}>
            검색
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={purchase_list_columns}
          data={userList}
          onRowClick={(row) => history.push(`/purchase/${row.purchase_no}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={listContext.page} setPage={handleContextChange} />

        <TextField
          variant="outlined"
          value={listContext.search_text}
          onChange={(e) => handleContextChange("search_text", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
