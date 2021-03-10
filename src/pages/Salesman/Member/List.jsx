import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography } from "components/materialui";
import { ColumnTable, Pagination, SearchBox } from "components";

const useStyles = makeStyles((theme) => ({
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

const member_list_columns = [
  { title: "이름", field: "name", width: 160 },
  { title: "코드값", field: "special_code", width: 100 },
  { title: "휴대폰번호", field: "phone", width: 160 },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "리워드액",
    render: ({ total_reward }) => `${price(total_reward) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "등급",
    render: ({ approval, grade_name }) => (approval ? grade_name : <span style={{ color: "red" }}>승인대기</span>),
    width: 160,
  },
];

export const ManageMemberList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);
  const query = qs.parse(location.search);

  const [memberList, setMemberList] = useState();

  async function getMemberList() {
    if (!member.special_code) return;

    let data = await apiObject.getSalsemanClientList({
      special_code: member.special_code,
      ...query,
    });
    setMemberList(data);
  }

  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/member?" + qs.stringify(query));
  }

  useEffect(() => {
    getMemberList();
  }, [member, query.page, query.search_word, query.sort_item, query.sort_type]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        회원 목록
      </Typography>

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
