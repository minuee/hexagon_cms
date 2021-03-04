import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, ExcelExportButton } from "components";

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

const salesman_list_columns = [
  { title: "이름", field: "name", width: 100 },
  { title: "코드값", field: "special_code", width: 100 },
  { title: "휴대폰번호", field: "phone", width: 160 },
  {
    title: "구매대행액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브액",
    render: ({ total_incentive }) => `${price(total_incentive)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "상태",
    render: ({ use_yn }) => (use_yn ? "이용중" : "퇴사"),
    width: 100,
  },
];
const header_button_list = [
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "구매액순",
    value: "order",
  },
  {
    label: "인센티브액순",
    value: "incentive",
  },
];
const excel_columns = [
  { label: "이름", value: "name" },
  { label: "코드값", value: "special_code" },
  { label: "휴대폰번호", value: "phone" },
  {
    label: "구매대행액",
    value: "total_amount",
    render: ({ total_amount }) => `${price(total_amount)}원`,
  },
  {
    label: "인센티브액",
    value: "total_incentive",
    render: ({ total_incentive }) => `${price(total_incentive)}원`,
  },
  {
    label: "상태",
    value: "use_yn",
    render: ({ use_yn }) => (use_yn ? "이용중" : "퇴사"),
  },
];

export const SalesmanList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [salesmanList, setSalesmanList] = useState();

  async function getSalesmanList() {
    let data = await apiObject.getSalesmanList({ ...query });
    setSalesmanList(data);
  }

  function handleQueryChange(q, v) {
    if (q == "sort_item") {
      if (v == (query[q] || "uname")) {
        query.sort_type = query?.sort_type === "ASC" ? "DESC" : "ASC";
      } else {
        query.sort_type = "DESC";
      }
    }
    if (q != "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/salesman?" + qs.stringify(query));
  }

  useEffect(() => {
    getSalesmanList();
  }, [query.page, query.search_word, query.sort_item, query.sort_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          영업사원목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => {
            let is_cur = item.value === (query.sort_item || "uname");
            return (
              <Button variant="text" onClick={() => handleQueryChange("sort_item", item.value)} key={index}>
                <Typography fontWeight={is_cur ? "700" : undefined}>{item.label}</Typography>
                {is_cur && <>{query.sort_type === "ASC" ? <ArrowDropUp /> : <ArrowDropDown />}</>}
              </Button>
            );
          })}
          <Button color="primary" ml={2} onClick={() => history.push("/salesman/regist")}>
            영업사원등록
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={salesman_list_columns}
          data={salesmanList}
          onRowClick={(row) => history.push(`/salesman/${row.member_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <ExcelExportButton data={salesmanList} columns={excel_columns} path="Salesman" />

        <Pagination page={query.page} setPage={handleQueryChange} count={Math.ceil(+salesmanList?.[0]?.total / 10)} />

        {/* <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} /> */}
      </Grid>
    </Box>
  );
};
