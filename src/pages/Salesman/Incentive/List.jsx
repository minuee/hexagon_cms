import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { price } from "common";
import { apiObject } from "api";

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

  const [incentiveData, setIncentiveData] = useState();

  async function getIncentiveList() {
    if (!member.member_pk) return;

    let data = await apiObject.getSalesmanDetail({ member_pk: member.member_pk });
    setIncentiveData(data);
  }

  useEffect(() => {
    getIncentiveList();
  }, [member]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          월별 인센티브 현황
        </Typography>

        <Typography display="inline">누적 인센티브액: {price(incentiveData?.total_incentive)}원</Typography>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={incentive_list_columns}
          data={incentiveData?.incentive}
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
