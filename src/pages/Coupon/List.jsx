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
    justifyContent: "flex-end",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const coupon_list_columns = [
  { title: "번호", field: "coupon_pk" },
  { title: "이름", field: "name" },
  {
    title: "쿠폰내용",
    field: "coupon_content",
  },
  { title: "배포수량", field: "distribute_amount" },
  { title: "사용수량", field: "use_amount" },
  {
    title: "사용기간시작",
    render: ({ coupon_start_dt }) => dayjs.unix(coupon_start_dt).format("YYYY-MM-DD"),
  },
  {
    title: "사용기간끝",
    render: ({ coupon_end_dt }) => dayjs.unix(coupon_end_dt).format("YYYY-MM-DD"),
  },
];
const coupon_list_rows = [
  {
    coupon_pk: 1,
    name: "첫가입환영쿠폰",
    coupon_content: "15000미만 상품 1+1",
    distribute_amount: 9976,
    use_amount: 5544,
    coupon_start_dt: 1099287399,
    coupon_end_dt: 1398287399,
  },
  {
    coupon_pk: 2,
    name: "이벤트수신동의보상",
    coupon_content: "20000이상 상품 10% 할인 (최대적용 5000)",
    distribute_amount: 900,
    use_amount: 122,
    coupon_start_dt: 1599287399,
    coupon_end_dt: 1698287399,
  },
  {
    coupon_pk: 3,
    name: "서버점검보상",
    coupon_content: "배송비무료",
    distribute_amount: 9999,
    use_amount: 72,
    coupon_start_dt: 1999287399,
    coupon_end_dt: 2198287399,
  },
];

export const CouponList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [couponList, setCouponList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    sort_item: "",
    sort_type: "",
  });

  async function getCouponList() {
    console.log("get coupon list called");
    setCouponList(coupon_list_rows);
  }

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    getCouponList();
  }, [listContext.page, listContext.sort_item, listContext.sort_type]);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        쿠폰목록
      </Typography>

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
          onKeyDown={(e) => e.key === "Enter" && getCouponList()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={getCouponList}>
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
