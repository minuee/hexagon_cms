import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
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

const notice_list_columns = [
  { title: "번호", field: "no", width: 80 },
  {
    title: "구매자이름",
    field: "name",
    width: 160,
  },
  {
    title: "주문번호",
    field: "special_code",
    width: 160,
  },
  {
    title: "구매일시",
    render: ({ purchase_dt }) => dayjs.unix(purchase_dt).format("YYYY-MM-DD hh:mm"),
  },
  {
    title: "구매액",
    render: ({ purchase_amount }) => `${price(purchase_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브액",
    render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const notice_list_rows = [
  {
    no: 1,
    purchase_no: 1,
    special_code: "20200506-D5446",
    name: "전상우",
    purchase_dt: 1791812812,
    purchase_amount: 4879200,
    incentive_amount: 10200,
  },
  {
    no: 2,
    purchase_no: 2,
    special_code: "20200506-D5446",
    name: "이병헌",
    purchase_dt: 1791000000,
    purchase_amount: 1098200,
    incentive_amount: 5790,
  },
  {
    no: 3,
    purchase_no: 3,
    special_code: "20200506-D5446",
    name: "임원희",
    purchase_dt: 1790919800,
    purchase_amount: 20198200,
    incentive_amount: 89000,
  },
];

export const IncentiveDetail = () => {
  const classes = useStyles();
  const history = useHistory();

  const [noticeList, setNoticeList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
  });

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    setNoticeList(notice_list_rows);
  }, []);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        {2026}년 {10}월 인센티브 목록
      </Typography>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={notice_list_columns}
          data={noticeList}
          onRowClick={(row) => history.push(`/incentive/1/${row.purchase_no}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        {/* <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        <Pagination page={listContext.page} setPage={handleContextChange} />

        <TextField
          name="search_text"
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
