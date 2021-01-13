import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";

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
  { title: "코드값", field: "member_pk" },
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
    render: ({ approval, special_code }) => (approval ? special_code : "회원가입 미승인"),
  },
];

export const UserList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [userList, setUserList] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    sort_item: "",
    sort_type: "",
  });

  async function getUserList() {
    let data = await apiObject.getMemberList({
      ...listContext,
    });

    setUserList(data);
    console.log(data);
  }

  function handleSignInApprove() {
    console.log(selectedUsers);
  }
  function handleSortClicked(value) {
    if (listContext.sort_item === value) {
      if (listContext.sort_type === "DESC") {
        handleContextChange("sort_type", "ASC");
      } else {
        handleContextChange("sort_type", "DESC");
      }
    } else {
      setListContext({
        ...listContext,
        sort_item: value,
        sort_type: "DESC",
      });
    }
  }
  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    getUserList();
    console.log(listContext);
  }, [listContext.page, listContext.sort_item, listContext.sort_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          유저목록
        </Typography>

        <Box className={classes.header_buttons}>
          <Button onClick={() => handleSortClicked("uname")}>
            <Typography fontWeight={listContext.sort_item === "uname" ? "700" : undefined}>이름순</Typography>
            {listContext.sort_item === "uname" && (
              <>{listContext.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
            )}
          </Button>
          <Button onClick={() => handleSortClicked("reg")}>
            <Typography fontWeight={listContext.sort_item === "reg" ? "700" : undefined}>가입일자순</Typography>
            {listContext.sort_item === "reg" && (
              <>{listContext.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
            )}
          </Button>
          <Button onClick={() => handleSortClicked("no")}>
            <Typography fontWeight={listContext.sort_item === "no" ? "700" : undefined}>번호순</Typography>
            {listContext.sort_item === "no" && (
              <>{listContext.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
            )}
          </Button>
          <Button onClick={() => handleSortClicked("order")}>
            <Typography fontWeight={listContext.sort_item === "order" ? "700" : undefined}>구매액순</Typography>
            {listContext.sort_item === "order" && (
              <>{listContext.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
            )}
          </Button>
          <Button onClick={() => handleSortClicked("reward")}>
            <Typography fontWeight={listContext.sort_item === "reward" ? "700" : undefined}>리워드액순</Typography>
            {listContext.sort_item === "reward" && (
              <>{listContext.sort_type === "DESC" ? <ArrowDropDown /> : <ArrowDropUp />}</>
            )}
          </Button>
          <Button variant="contained" color="primary" ml={3} onClick={handleSignInApprove}>
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

        <Pagination
          page={listContext.page}
          setPage={handleContextChange}
          count={Math.ceil(+userList?.[0]?.total / 10)}
        />

        <TextField
          name="search_word"
          variant="outlined"
          value={listContext.search_word}
          onChange={(e) => handleContextChange("search_word", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getUserList()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={getUserList}>
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
