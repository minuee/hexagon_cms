import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment, Avatar } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

const useStyles = makeStyles((theme) => ({
  table_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: theme.spacing(1),
  },

  table_image: {
    display: "inline-block",
    width: "60px",
    height: "60px",

    "& img": {
      objectFit: "contain",
    },
  },
}));

const popup_list_rows_1 = [
  {
    cur_popup_no: 1,
    cur_popup_img: "/image/popup_sample_1.png",
    popup_type_text: "전면 팝업창",
    popup_start_dt: 1622001453,
  },
  {
    cur_popup_no: 2,
    cur_popup_img: "/image/popup_sample_2.png",
    popup_type_text: "전면 팝업창",
    popup_start_dt: 1622001453,
  },
  {
    cur_popup_no: 3,
    cur_popup_img: "/image/popup_sample_3.png",
    popup_type_text: "전면 팝업창",
    popup_start_dt: 1622001453,
  },
];
const popup_list_rows_2 = [
  {
    prev_popup_no: 1,
    prev_popup_img: "/image/popup_sample_1.png",
    popup_type_text: "전면 팝업창",
    popup_start_dt: 1622001453,
    popup_end_dt: 1622001453,
  },
  {
    prev_popup_no: 2,
    prev_popup_img: "/image/popup_sample_2.png",
    popup_type_text: "후면 팝업창",
    popup_start_dt: 1622001453,
    popup_end_dt: 1622001453,
  },
  {
    prev_popup_no: 3,
    prev_popup_img: "/image/popup_sample_3.png",
    popup_type_text: "레이어 팝업창",
    popup_start_dt: 1622001453,
    popup_end_dt: 1622001453,
  },
];

export const PopupList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [curPopupList, setCurPopupList] = useState();
  const [selectedCurPopup, setSelectedCurPopup] = useState([]);
  const [prevPopupList, setPrevPopupList] = useState();
  const [selectedPrevPopup, setSelectedPrevPopup] = useState([]);

  const [popupType, setPopupType] = useState("notice");

  const [listContext, setListContext] = useState({
    cur_popup_page: 1,
    prev_popup_page: 1,
  });

  const popup_list_columns_1 = [
    {
      title: "이미지",
      render: ({ cur_popup_img }) => <Avatar variant="square" src={cur_popup_img} className={classes.table_image} />,
      width: 180,
    },
    { title: "팝업 종류", field: "popup_type_text" },
    {
      title: "시작 시간",
      render: ({ popup_start_dt }) => `${dayjs.unix(popup_start_dt).format("YYYY-MM-DD hh:mm")}부터 적용`,
    },
  ];
  const popup_list_columns_2 = [
    {
      title: "이미지",
      render: ({ prev_popup_img }) => <Avatar variant="square" src={prev_popup_img} className={classes.table_image} />,
      width: 180,
    },
    { title: "팝업 종류", field: "popup_type_text" },
    {
      title: "게시 시간",
      render: ({ popup_start_dt, popup_end_dt }) =>
        `${dayjs.unix(popup_start_dt).format("YYYY-MM-DD hh:mm")}부터 
      ${dayjs.unix(popup_end_dt).format("YYYY-MM-DD hh:mm")}까지 적용
      `,
    },
  ];

  function handleRemovePopup(type) {
    if (type === "cur") {
      console.log("cur", selectedCurPopup);
    } else if (type === "prev") {
      console.log("prev", selectedPrevPopup);
    }
  }
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
    setCurPopupList(popup_list_rows_1);
    setPrevPopupList(popup_list_rows_2);
  }, []);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        팝업관리
      </Typography>
      <Box display="flex" mt={2}>
        <Button color={popupType === "notice" ? "primary" : undefined} onClick={() => setPopupType("notice")}>
          공지
        </Button>
        <Button ml={2} color={popupType === "event" ? "primary" : undefined} onClick={() => setPopupType("event")}>
          상품 이벤트
        </Button>
      </Box>

      <Box mt={4}>
        <Box className={classes.table_header}>
          <Typography variant="h6" fontWeight="500">
            현재
          </Typography>
          <Box>
            <Button color="primary" mr={2} onClick={() => history.push(`/popup/${popupType}/cur/add`)}>
              등록
            </Button>
            <Button color="secondary" onClick={() => handleRemovePopup("cur")}>
              삭제
            </Button>
          </Box>
        </Box>

        <ColumnTable
          columns={popup_list_columns_1}
          data={curPopupList}
          onRowClick={(row) => history.push(`/popup/${popupType}/cur/${row.cur_popup_no}`)}
          selection
          onSelectionChange={setSelectedCurPopup}
        />

        <Box position="relative" mt={6}>
          <Pagination page={listContext.page} setPage={handleContextChange} name="cur_popup_page" />
        </Box>
      </Box>

      <Box mt={16} mb={12}>
        <Box className={classes.table_header}>
          <Typography variant="h6" fontWeight="500">
            지난
          </Typography>
          <Box>
            <Button color="primary" mr={2} onClick={() => history.push(`/popup/${popupType}/prev/add`)}>
              등록
            </Button>
            <Button color="secondary" onClick={() => handleRemovePopup("prev")}>
              삭제
            </Button>
          </Box>
        </Box>

        <ColumnTable
          columns={popup_list_columns_2}
          data={prevPopupList}
          onRowClick={(row) => history.push(`/popup/${popupType}/prev/${row.prev_popup_no}`)}
          selection
          onSelectionChange={setSelectedPrevPopup}
        />

        <Box position="relative" mt={6}>
          <Pagination page={listContext.page} setPage={handleContextChange} name="prev_popup_page" />
        </Box>
      </Box>

      {/* <Grid container className={classes.table_footer}>
        <Button  p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

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
      </Grid> */}
    </Box>
  );
};
