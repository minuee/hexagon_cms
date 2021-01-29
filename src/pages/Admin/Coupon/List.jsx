import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";
import qs from "query-string";

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
    justifyContent: "flex-end",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const header_button_list = [
  {
    label: "전체",
    // value: "",
  },
  {
    label: "미사용",
    value: "N",
  },
  {
    label: "사용완료",
    value: "Y",
  },
];
const coupon_list_columns = [
  { title: "번호", field: "coupon_pk", width: 80 },
  { title: "사용자", field: "coupon_user" },
  { title: "금액", render: ({ coupon_type }) => price(coupon_type) },
  {
    title: "발행일자",
    render: ({ coupon_regist_dt }) => dayjs.unix(coupon_regist_dt).format("YYYY-MM-DD"),
    width: 160,
  },
  { title: "사용여부", render: ({ use_yn }) => (use_yn ? "Y" : "N"), width: 120 },
];
const coupon_list_rows = [
  {
    coupon_pk: 1,
    coupon_user: "업체",
    coupon_type: 5000,
    coupon_regist_dt: 1099287399,
    use_yn: false,
  },
];

export const CouponList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [couponList, setCouponList] = useState();
  const [searchWord, setSearchWord] = useState("");

  async function getCouponList() {
    console.log({
      ...query,
    });
    setCouponList(coupon_list_rows);
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/coupon?" + qs.stringify(query));
  }

  useEffect(() => {
    getCouponList();
  }, [query.page, query.filter_item, query.search_word]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          쿠폰 목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => (
            <Button onClick={() => handleQueryChange("filter_item", item.value)} key={index}>
              <Typography fontWeight={query.filter_item === item.value ? "700" : undefined}>{item.label}</Typography>
            </Button>
          ))}

          <Button variant="contained" ml={3} onClick={() => history.push(`/coupon/add`)}>
            쿠폰 등록
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
        {/* <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        <Pagination
          page={query.page || 1}
          setPage={handleQueryChange}
          count={10}
          // count={Math.ceil(+userList?.[0]?.total / 10)}
        />

        <TextField
          name="search_word"
          variant="outlined"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQueryChange("search_word", searchWord)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => handleQueryChange("search_word", searchWord)}>
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
