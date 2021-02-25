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

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const header_button_list = [
  {
    label: "진행중",
    value: "now",
  },
  {
    label: "마감",
    value: "stop",
  },
];
const event_list_columns = [
  { title: "번호", field: "no", width: 80 },
  { title: "종류", field: "event_gubun_text", width: 160 },
  { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
  {
    title: "등록일",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
    width: 120,
  },
  {
    title: "시작일",
    render: ({ start_dt }) => dayjs.unix(start_dt).format("YYYY-MM-DD"),
    width: 120,
  },
];

export const EventList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [eventList, setEventList] = useState();

  async function getEventList() {
    let data = await apiObject.getEventList({ ...query });
    setEventList(data);
  }

  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

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
          {header_button_list.map((item, index) => {
            let is_cur = item.value === (query.filter_item || "now");

            return (
              <Button variant="text" onClick={() => handleQueryChange("filter_item", item.value)} key={index}>
                <Typography fontWeight={is_cur ? "700" : undefined}>{item.label}</Typography>
              </Button>
            );
          })}

          <Button color="primary" ml={3} onClick={() => history.push(`/event/add`)}>
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

        <Pagination page={query.page || 1} setPage={handleQueryChange} count={Math.ceil(+eventList?.[0]?.total / 10)} />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
