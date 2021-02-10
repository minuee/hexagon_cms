import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiObject } from "api";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
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

const notice_list_columns = [
  { title: "번호", field: "no", width: 80 },
  {
    title: "제목",
    render: ({ title }) => (title?.length > 20 ? title?.substring(0, 20) : title),
    cellStyle: { textAlign: "left" },
  },
  {
    title: "등록일시",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD hh:mm"),
    width: 240,
  },
  {
    title: "발송여부",
    render: ({ send_push }) => (send_push ? "Y" : "N"),
    width: 120,
  },
];

export const NoticeList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [noticeList, setNoticeList] = useState();
  const [searchWord, setSearchWord] = useState("");

  async function getNoticeList() {
    let data = await apiObject.getNoticeList({ ...query });

    setNoticeList(data);
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/notice?" + qs.stringify(query));
  }

  useEffect(() => {
    getNoticeList();
  }, [query.page, query.search_word]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          공지사항 목록
        </Typography>

        <Button color="primary" onClick={() => history.push("/notice/add")}>
          등록
        </Button>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={notice_list_columns}
          data={noticeList}
          onRowClick={(row) => history.push(`/notice/${row.notice_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        {/* <Button  p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        <Pagination
          page={query.page || 1}
          setPage={handleQueryChange}
          count={Math.ceil(+noticeList?.[0]?.total / 10)}
        />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
