import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
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

const notice_list_columns = [
  { field: "notice_no", title: "번호", width: "80px" },
  {
    field: "notice_title",
    title: "제목",
    render: ({ notice_title }) => (notice_title?.length > 20 ? notice_title?.substring(0, 20) : notice_title),
  },
  {
    field: "notice_content",
    title: "내용",
    render: ({ notice_content }) =>
      notice_content?.length > 20 ? `${notice_content?.substring(0, 20)}...` : notice_content,
  },
  {
    field: "register_dt",
    title: "업로드 일시",
    render: ({ register_dt }) => dayjs.unix(register_dt).format("YYYY-MM-DD hh:mm"),
  },
  {
    field: "push_yn",
    title: "Push 알림 발송",
    render: ({ push_yn }) => (push_yn ? "Y" : "N"),
  },
];
const notice_list_rows = [
  {
    notice_no: 1,
    notice_title: "설 연휴 배송 일정 지연 공지",
    notice_content:
      "설 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 설 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 설 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다.",
    register_dt: 1605215112,
    push_yn: true,
  },
  {
    notice_no: 2,
    notice_title: "추석 연휴 배송 일정 지연 공지",
    notice_content:
      "추석 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 추석 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 추석 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다.",
    register_dt: 1605298112,
    push_yn: false,
  },
  {
    notice_no: 3,
    notice_title: "크리스마스 연휴 배송 일정 지연 공지",
    notice_content:
      "크리스마스 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 크리스마스 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 크리스마스 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다.",
    register_dt: 1610915112,
    push_yn: false,
  },
  {
    notice_no: 4,
    notice_title: "추수감사절 연휴 배송 일정 지연 공지",
    notice_content:
      "추수감사절 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 추수감사절 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다. 추수감사절 연휴 배송량 급증에 의한 배송 일정 지연을 공지드립니다.",
    register_dt: 1605276912,
    push_yn: false,
  },
];

export const NoticeList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [noticeList, setNoticeList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
  });

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    console.log("listContext", listContext);
  }, [listContext]);

  useEffect(() => {
    setNoticeList(notice_list_rows);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          공지사항 목록
        </Typography>

        <Button variant="contained" onClick={() => history.push("/notice/add")}>
          등록
        </Button>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={notice_list_columns}
          data={noticeList}
          onRowClick={(row) => history.push(`/notice/${row.notice_no}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={listContext.page} setPage={handleContextChange} />

        <TextField
          name="search_text"
          variant="outlined"
          value={listContext.search_text}
          onChange={(e) => handleContextChange("search_text", e.target.value)}
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
