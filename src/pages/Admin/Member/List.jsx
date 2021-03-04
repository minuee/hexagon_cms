import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, SearchBox, ExcelExportButton } from "components";

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

const member_list_columns = [
  { title: "이름", field: "name" },
  { title: "코드값", field: "special_code", width: 100 },
  {
    title: "구매총액",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "리워드잔액",
    render: ({ reward_point }) => `${price(reward_point) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "등급", field: "grade_name", width: 100 },
  {
    title: "비고",
    render: ({ approval, agent_code }) => (approval ? `영업사원코드:  ${agent_code}` : "회원가입 미승인"),
  },
];
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
    label: "번호순",
    value: "no",
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
const excel_columns = [
  { label: "이름", value: "name" },
  { label: "코드값", value: "special_code" },
  {
    label: "구매총액",
    value: "total_amount",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
  },
  {
    label: "리워드잔액",
    value: "reward_point",
    render: ({ reward_point }) => `${price(reward_point) || 0}원`,
  },
  { label: "등급", value: "grade_name" },
  {
    label: "비고",
    value: "approval",
    render: ({ approval, agent_code }) => (approval ? `영업사원코드:  ${agent_code}` : "회원가입 미승인"),
  },
];

export const MemberList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [memberList, setMemberList] = useState();
  const [selectedMembers, setSelectedMembers] = useState([]);

  async function getMemberList() {
    let data = await apiObject.getMemberList({
      ...query,
    });

    setMemberList(data);
  }
  async function approveSignIn() {
    if (!window.confirm("선택한 유저들을 회원가입 승인하시겠습니까?")) return;

    let member_array = [];
    selectedMembers.forEach((item) => {
      if (!item.approval) {
        member_array.push({
          member_pk: item.member_pk,
        });
      }
    });

    await apiObject.approveMembers({ member_array });
    getMemberList();
  }

  function handleQueryChange(q, v) {
    if (q == "sort_item") {
      if (v == (query[q] || "reg")) {
        query.sort_type = query?.sort_type === "ASC" ? "DESC" : "ASC";
      } else {
        query.sort_type = "DESC";
      }
    }
    if (q !== "page") {
      query.page = 1;
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
          유저목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => {
            let is_cur = item.value === (query.sort_item || "reg");
            return (
              <Button variant="text" onClick={() => handleQueryChange("sort_item", item.value)} key={index}>
                <Typography fontWeight={is_cur ? "700" : undefined}>{item.label}</Typography>
                {is_cur && <>{query.sort_type === "ASC" ? <ArrowDropUp /> : <ArrowDropDown />}</>}
              </Button>
            );
          })}

          <Button color="primary" ml={3} onClick={approveSignIn} disabled={!selectedMembers?.length}>
            회원가입 승인
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={member_list_columns}
          data={memberList}
          onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
          selection
          onSelectionChange={setSelectedMembers}
          options={{
            selectionProps: (props) => ({
              style: {
                display: props.approval && "none",
              },
            }),
          }}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <ExcelExportButton data={memberList} columns={excel_columns} path="Member" />

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
