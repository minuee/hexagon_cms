import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography } from "components/materialui";
import { ColumnTable } from "components";

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

const header_button_list = [
  {
    label: "가입일자순",
    value: "reg",
  },
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "구매액순",
    value: "order",
  },
  {
    label: "리워드액순",
    value: "reward",
  },
];
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
  const { getDataFunction, Pagination, FilterBox, SearchBox } = useQuery(location);

  const [memberList, setMemberList] = useState();

  async function getMemberList(query) {
    if (!member.special_code) return;

    let data = await apiObject.getSalsemanClientList({
      special_code: member.special_code,
      ...query,
    });
    setMemberList(data);
  }

  useEffect(() => {
    getDataFunction(getMemberList);
  }, [member]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography display="inline" variant="h5" fontWeight="500">
          회원 목록
        </Typography>

        <FilterBox type="sort" button_list={header_button_list} default_item="reg" />
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={member_list_columns}
          data={memberList}
          onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Pagination total={memberList?.[0]?.total} />
        <SearchBox />
      </Grid>
    </Box>
  );
};
