import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { DescriptionOutlined, Search, ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, SearchBox } from "components";

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
    // justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const member_list_columns = [
  { title: "이름", field: "name", width: 160 },
  { title: "코드값", field: "special_code", width: 100 },
  { title: "휴대폰번호", field: "phone", width: 160 },
  // { title: "이메일주소", field: "email" },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  // {
  //   title: "리워드액",
  //   render: ({ reward_point }) => `${price(reward_point) || 0}원`,
  //   cellStyle: { textAlign: "right" },
  // },
  { title: "등급", field: "grade_name", width: 100 },
  // {
  //   title: "비고",
  //   render: ({ approval, agent_code }) => (approval ? `영업사원코드:  ${agent_code}` : "회원가입 미승인"),
  // },
];
const header_button_list = [
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "가입일자순",
    value: "reg",
  },
  {
    label: "번호순",
    value: "no",
  },
  {
    label: "구매액순",
    value: "order",
  },
];

export const ManageMemberList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [memberList, setMemberList] = useState();

  async function getMemberList() {
    let data = await apiObject.getMemberList({
      ...query,
    });

    setMemberList(data);
  }

  function handleQueryChange(q, v) {
    if (q == "sort_item") {
      if (query[q] == v) {
        query.sort_type = query?.sort_type === "DESC" ? "ASC" : "DESC";
      } else {
        query.sort_type = "DESC";
      }
    }

    query[q] = v;
    history.push("/member?" + qs.stringify(query));
  }

  useEffect(() => {
    getMemberList();
  }, [query.page, query.search_word, query.sort_item, query.sort_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          회원 목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => (
            <Button variant="text" onClick={() => handleQueryChange("sort_item", item.value)} key={index}>
              <Typography fontWeight={query.sort_item === item.value ? "700" : undefined}>{item.label}</Typography>
              {query.sort_item === item.value && (
                <>{query.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
              )}
            </Button>
          ))}
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={member_list_columns}
          data={memberList}
          onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Pagination
          page={query.page || 1}
          setPage={handleQueryChange}
          count={Math.ceil(+memberList?.[0]?.total / 10)}
        />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
