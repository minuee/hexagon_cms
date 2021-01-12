import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
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
    order_type: "",
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
  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    getUserList();
  }, [listContext.page, listContext.order_type]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          유저목록
        </Typography>

        <Box className={classes.header_buttons}>
          <Button onClick={() => handleContextChange("order_type", "uname")}>
            <Typography fontWeight={listContext.order_type === "uname" && "700"}>이름순</Typography>
          </Button>
          <Button onClick={() => handleContextChange("order_type", "reg")}>
            <Typography fontWeight={listContext.order_type === "reg" && "700"}>가입일자순</Typography>
          </Button>
          <Button onClick={() => handleContextChange("order_type", "no")}>
            <Typography fontWeight={listContext.order_type === "no" && "700"}>번호순</Typography>
          </Button>
          <Button onClick={() => handleContextChange("order_type", "order")}>
            <Typography fontWeight={listContext.order_type === "order" && "700"}>구매액순</Typography>
          </Button>
          <Button onClick={() => handleContextChange("order_type", "reward")}>
            <Typography fontWeight={listContext.order_type === "reward" && "700"}>리워드액순</Typography>
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
