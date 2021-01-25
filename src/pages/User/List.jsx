import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { DescriptionOutlined, Search, ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
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
    justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const user_list_columns = [
  { title: "이름", field: "name" },
  { title: "코드값", field: "special_code" },
  { title: "휴대폰번호", field: "phone" },
  { title: "이메일주소", field: "email" },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "리워드액",
    render: ({ reward_point }) => `${price(reward_point) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "등급", field: "grade_name" },
  {
    title: "비고",
    render: ({ approval, agent_code }) => (approval ? agent_code : "회원가입 미승인"),
  },
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
  {
    label: "리워드액순",
    value: "reward",
  },
];

export const UserList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [userList, setUserList] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  async function getUserList() {
    let data = await apiObject.getMemberList({
      ...query,
    });

    setUserList(data);
  }
  async function approveSignIn() {
    let member_array = [];
    selectedUsers.forEach((item) => {
      member_array.push({
        member_pk: item.member_pk,
      });
    });

    if (window.confirm("선택한 유저들을 회원가입 승인하시겠습니까?")) {
      let resp = await apiObject.approveMembers({ member_array });
      console.log(resp);

      getUserList();
    }
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
    history.push("/user?" + qs.stringify(query));
  }

  useEffect(() => {
    getUserList();
  }, [query.page, query.search_word, query.sort_item, query.sort_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          유저목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => (
            <Button onClick={() => handleQueryChange("sort_item", item.value)} key={index}>
              <Typography fontWeight={query.sort_item === item.value ? "700" : undefined}>{item.label}</Typography>
              {query.sort_item === item.value && (
                <>{query.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
              )}
            </Button>
          ))}

          <Button variant="contained" color="primary" ml={3} onClick={approveSignIn}>
            회원가입 승인
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={user_list_columns}
          data={userList}
          onRowClick={(row) => history.push(`/user/${row.member_pk}`)}
          selection
          onSelectionChange={setSelectedUsers}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={query.page || 1} setPage={handleQueryChange} count={Math.ceil(+userList?.[0]?.total / 10)} />

        <TextField
          name="search_word"
          variant="outlined"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQueryChange("search_word", searchWord)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => handleQueryChange("search_word", searchWord)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
