import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { Table, Pagination } from "components";

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
  { field: "user_name", title: "이름" },
  { field: "user_code", title: "코드값" },
  { field: "user_phone", title: "휴대폰번호" },
  { field: "user_email", title: "이메일주소" },
  { field: "purchase_amount", title: "구매액" },
  { field: "reward_amount", title: "리워드액" },
  { field: "user_grade", title: "등급" },
  { field: "remark", title: "비고" },
];
const user_list_rows = [
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
  {
    user_name: "륶인창",
    user_code: "81JK3D",
    user_phone: "01022223333",
    user_email: "sss@mmmelk.com",
    purchase_amount: 55555555,
    reward_amount: 1111111111,
    user_grade: "골드",
    remark: "-",
  },
];

export const User = () => {
  const classes = useStyles();

  const [userList, setUserList] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
  });

  function handleSignInApprove() {
    console.log(selectedUsers);
  }
  function handleSearchTextChange(e) {
    setListContext({
      ...listContext,
      search_text: e.target.value,
    });
  }
  function handlePageChange(value) {
    setListContext({
      ...listContext,
      page: value,
    });
  }

  useEffect(() => {
    console.log("listContext", listContext);
  }, [listContext]);

  useEffect(() => {
    setUserList(user_list_rows);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          유저목록
        </Typography>

        <Box className={classes.header_buttons}>
          <Button>이름순</Button>
          <Button>가입일자순</Button>
          <Button>번호순</Button>
          <Button>구매액순</Button>
          <Button>리워드액순</Button>
          <Button variant="contained" color="primary" ml={3} onClick={handleSignInApprove}>
            회원가입 승인
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <Table columns={user_list_columns} data={userList} selection onSelectionChange={setSelectedUsers} />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={listContext.page} setPage={handlePageChange} />

        <TextField
          name="search_text"
          variant="outlined"
          value={listContext.search_text}
          onChange={handleSearchTextChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
