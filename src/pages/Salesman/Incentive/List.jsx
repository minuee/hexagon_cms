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
    title: "년월",
    render: ({ incentive_dt }) => dayjs.unix(incentive_dt).format("YYYY.MM"),
    width: 180,
  },
  {
    title: "구매총액",
    render: ({ purchase_amount }) => `${price(purchase_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브액",
    render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
];
const incentive_list_rows = [
  {
    no: 1,
    incentive_pk: 1,
    incentive_dt: 1794000000,
    incentive_amount: 21312200,
    purchase_amount: 2131220019820,
  },
  {
    no: 2,
    incentive_pk: 2,
    incentive_dt: 1791000000,
    incentive_amount: 9720,
    purchase_amount: 9789820,
  },
  {
    no: 3,
    incentive_pk: 3,
    incentive_dt: 1789000000,
    incentive_amount: 18600,
    purchase_amount: 18792300,
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
