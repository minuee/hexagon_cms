import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Box, makeStyles } from "@material-ui/core";
import { Typography } from "components/materialui";
import { ColumnTable } from "components";

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
    title: "날짜",
    field: "sales_month",
    width: 180,
  },
  {
    title: "총구매대행액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브액",
    render: ({ total_incentive }) => `${price(total_incentive)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const IncentiveList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);
  const query = qs.parse(location.search);

  const [incentiveList, setIncentiveList] = useState();

  async function getIncentiveList() {
    if (!member.member_pk) return;

    let data = await apiObject.getSalesmanDetail({ member_pk: member.member_pk });
    setIncentiveList(data.incentive);
  }

  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/incentive" + qs.stringify(query));
  }

  useEffect(() => {
    getIncentiveList();
  }, [member]);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        월별 인센티브 현황
      </Typography>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={incentive_list_columns}
          data={incentiveList}
          onRowClick={(row) => history.push(`/incentive/${row.sales_month}`)}
        />
      </Box>

      {/* <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

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
      </Grid> */}
    </Box>
  );
};
