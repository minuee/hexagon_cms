import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getFullImgURL } from "common";
import { apiObject } from "api";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable } from "components";

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

export const WebNoticeList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, SearchBox } = useQuery(location);

  const [noticeList, setNoticeList] = useState();

  async function getNoticeList(query) {
    let data = await apiObject.getWebNoticeList({ ...query });
    setNoticeList(data);
  }

  const notice_list_columns = [
    { title: "번호", field: "no", width: 80 },
    {
      title: "제목",
      render: ({ title }) => (title?.length > 20 ? title?.substring(0, 20) : title),
      cellStyle: { textAlign: "left" },
    },
    {
      title: "등록일시",
      render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD HH:mm"),
      width: 240,
    },
   
  ];

  useEffect(() => {
    getDataFunction(getNoticeList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          홈페이지 공지사항 목록
        </Typography>

        <Button color="primary" onClick={() => history.push("/webnotice/add")}>
          등록
        </Button>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={notice_list_columns}
          data={noticeList}
          onRowClick={(row) => history.push(`/webnotice/${row.notice_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Pagination total={noticeList?.[0]?.total} />

        <SearchBox />
      </Grid>
    </Box>
  );
};
