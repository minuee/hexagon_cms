import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
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
  const { getDataFunction, SearchBox, FilterBox } = useQuery(location);

  const [eventList, setEventList] = useState();

  async function getEventList(query) {
    let data = await apiObject.getEventList({ ...query });
    setEventList(data);
  }

  useEffect(() => {
    getDataFunction(getEventList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          이벤트 목록
        </Typography>

        <Box className={classes.header_buttons}>
          <FilterBox type="filter" button_list={header_button_list} default_item="now" />

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
        <Pagination total={eventList?.[0]?.total} />

        <SearchBox />
      </Grid>
    </Box>
  );
};
