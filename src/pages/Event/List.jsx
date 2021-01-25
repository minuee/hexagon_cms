import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";
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
    justifyContent: "flex-end",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const header_button_list = [
  {
    label: "전체",
    // value: "",
  },
  {
    label: "진행중",
    value: "N",
  },
  {
    label: "마감",
    value: "Y",
  },
];
const event_list_columns = [
  { title: "번호", field: "event_pk" },
  { title: "종류", field: "event_type" },
  { title: "제목", field: "title" },
  {
    title: "등록일",
    render: ({ event_regist_dt }) => dayjs.unix(event_regist_dt).format("YYYY-MM-DD"),
  },
  {
    title: "시작일",
    render: ({ event_start_dt }) => dayjs.unix(event_start_dt).format("YYYY-MM-DD"),
  },
  {
    title: "종료일",
    render: ({ event_end_dt }) => dayjs.unix(event_end_dt).format("YYYY-MM-DD"),
  },
  { title: "종료여부", render: ({ termination_yn }) => (termination_yn ? "Y" : "N") },
];
const event_list_rows = [
  {
    event_pk: 1,
    event_type: "TERM",
    title: "특별감사세일",
    event_regist_dt: 1099287399,
    event_start_dt: 1499287399,
    event_end_dt: 1698287399,
    termination_yn: false,
  },
];

export const EventList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [eventList, setEventList] = useState();
  const [searchWord, setSearchWord] = useState("");

  async function getEventList() {
    console.log("get list called");
    setEventList(event_list_rows);
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/event?" + qs.stringify(query));
  }

  useEffect(() => {
    getEventList();
  }, [query.page, query.filter_item, query.search_word]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          이벤트 목록
        </Typography>

        <Box className={classes.header_buttons}>
          {header_button_list.map((item, index) => (
            <Button onClick={() => handleQueryChange("filter_item", item.value)} key={index}>
              <Typography fontWeight={query.filter_item === item.value ? "700" : undefined}>{item.label}</Typography>
            </Button>
          ))}

          <Button variant="contained" ml={3} onClick={() => history.push(`/event/add`)}>
            이벤트 등록
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={event_list_columns}
          data={eventList}
          onRowClick={(row) => history.push(`/event/${row.event_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        {/* <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        <Pagination
          page={query.page || 1}
          setPage={handleQueryChange}
          count={10}
          // count={Math.ceil(+userList?.[0]?.total / 10)}
        />

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
