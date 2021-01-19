import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { DescriptionOutlined, Search, ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

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
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const product_list_columns = [
  { title: "번호", field: "product_pk" },
  { title: "이름", field: "name" },
  {
    title: "이벤트가",
    render: ({ event_price }) => `${price(event_price) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "잔존수량", field: "remain_amount" },
  {
    title: "이벤트시작일",
    render: ({ event_start_dt }) => dayjs.unix(event_start_dt).format("YYYY-MM-DD"),
  },
  {
    title: "이벤트종료일",
    render: ({ event_end_dt }) => dayjs.unix(event_end_dt).format("YYYY-MM-DD"),
  },
];
const product_list_rows = [
  {
    product_pk: 1,
    name: "쇠수세미",
    event_price: 998877,
    remain_amount: 33,
    event_start_dt: 1099287399,
    event_end_dt: 1398287399,
  },
  {
    product_pk: 2,
    name: "알루미늄수세미",
    event_price: 872577,
    remain_amount: 3,
    event_start_dt: 1599287399,
    event_end_dt: 1898287399,
  },
  {
    product_pk: 3,
    name: "플라스틱수세미",
    event_price: 8877,
    remain_amount: 190,
    event_start_dt: 1999287399,
    event_end_dt: 2298287399,
  },
];

export const EventProductList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [productList, setProductList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    sort_item: "",
    sort_type: "",
  });

  async function getEventProductList() {
    console.log("get list called");
    setProductList(product_list_rows);
  }

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    getEventProductList();
  }, [listContext.page, listContext.sort_item, listContext.sort_type]);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        이벤트상품목록
      </Typography>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={product_list_columns}
          data={productList}
          onRowClick={(row) => history.push(`/eventproduct/${row.product_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination
          page={listContext.page}
          setPage={handleContextChange}
          count={10}
          // count={Math.ceil(+userList?.[0]?.total / 10)}
        />

        <TextField
          name="search_word"
          variant="outlined"
          value={listContext.search_word}
          onChange={(e) => handleContextChange("search_word", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getEventProductList()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={getEventProductList}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
