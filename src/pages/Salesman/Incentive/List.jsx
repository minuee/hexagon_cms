import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import dayjs from "dayjs";
import qs from "query-string";

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

const incentive_list_columns = [
  {
    title: "번호",
    field: "no",
    width: 80,
  },
  {
    title: "해당 인센티브 월",
    render: ({ incentive_dt }) => dayjs.unix(incentive_dt).format("YYYY.MM"),
    width: 180,
  },
  {
    title: "총 인센티브 액",
    render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "구매고객 수",
    render: ({ purchase_member_num }) => `${price(purchase_member_num)}명`,
    width: 120,
  },
];
const incentive_list_rows = [
  {
    no: 1,
    incentive_pk: 1,
    incentive_dt: 1794000000,
    incentive_amount: 2131220019820,
    purchase_member_num: 1022,
  },
  {
    no: 2,
    incentive_pk: 2,
    incentive_dt: 1791000000,
    incentive_amount: 9789820,
    purchase_member_num: 11,
  },
  {
    no: 3,
    incentive_pk: 3,
    incentive_dt: 1789000000,
    incentive_amount: 2001982009,
    purchase_member_num: 97,
  },
];

export const IncentiveList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [incentiveList, setIncentiveList] = useState();
  const [searchWord, setSearchWord] = useState("");

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/incentive" + qs.stringify(query));
  }

  useEffect(() => {
    setIncentiveList(incentive_list_rows);
  }, []);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        월별 인센티브 현황
      </Typography>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={incentive_list_columns}
          data={incentiveList}
          onRowClick={(row) => history.push(`/incentive/${row.incentive_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        {/* <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        <Pagination page={query.page || 1} setPage={handleQueryChange} />

        <TextField
          name="search_text"
          variant="outlined"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
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
