import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiObject } from "api";
import { price, getFullImgURL } from "common";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment, Avatar } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

const useStyles = makeStyles((theme) => ({
  table_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& > *": {
      display: "inline-flex",
      alignItems: "center",
    },

    "& > :first-child > *": {
      marginRight: theme.spacing(2),
    },
    "& > :last-child > *": {
      marginLeft: theme.spacing(2),
    },
  },

  header_buttons: {
    display: "inline-flex",
    alignItems: "center",

    "& > *": {
      marginleft: theme.spacing(1),
    },
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

const type_buttons = [
  {
    label: "공지",
    value: "notice",
  },
  {
    label: "이벤트",
    value: "event",
  },
];
const filter_buttons = [
  {
    label: "진행중",
    value: "now",
  },
  {
    label: "마감",
    value: "stop",
  },
];

export const PopupList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [popupList, setPopupList] = useState();
  const [selectedPopup, setSelectedPopup] = useState([]);

  const cur_popup_columns = [
    {
      title: "이미지",
      render: ({ img_url }) => <Avatar variant="square" src={getFullImgURL(img_url)} className={classes.table_image} />,
      width: 180,
    },
    {
      title: "종류",
      render: ({ popup_type }) => (popup_type === "Layer" ? "레이어" : "전체화면"),
      width: 120,
    },
    { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "시작 시간",
      render: ({ start_dt }) => `${dayjs.unix(start_dt).format("YYYY-MM-DD hh:mm")}부터 적용`,
      width: 240,
    },
  ];
  const prev_popup_columns = [
    {
      title: "이미지",
      render: ({ img_url }) => <Avatar variant="square" src={getFullImgURL(img_url)} className={classes.table_image} />,
      width: 180,
    },
    {
      title: "종류",
      render: ({ popup_type }) => (popup_type === "Layer" ? "레이어" : "전체화면"),
      width: 120,
    },
    { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "게시 시간",
      render: ({ start_dt, end_dt }) =>
        `${dayjs.unix(start_dt).format("YYYY-MM-DD hh:mm")} ~
      ${dayjs.unix(end_dt).format("YYYY-MM-DD hh:mm")}`,
      width: 400,
    },
  ];

  async function getPopupList() {
    let data;

    if (query.type === "event") {
      if (query.filter === "stop") {
        data = await apiObject.getPrevEventPopupList({ ...query });
      } else {
        data = await apiObject.getCurEventPopupList({ ...query });
      }
    } else {
      if (query.filter === "stop") {
        data = await apiObject.getPrevNoticePopupList({ ...query });
      } else {
        data = await apiObject.getCurNoticePopupList({ ...query });
      }
    }

    setPopupList(data);
  }
  async function removePopups() {
    if (!window.confirm("선택한 팝업들을 삭제하시겠습니까?")) return;

    let popup_array = [];
    selectedPopup.forEach((item) => {
      popup_array.push({ popup_pk: item.popup_pk });
    });

    switch (query.type || "notice") {
      case "notice":
        await apiObject.removeNoticePopupMultiple({ popup_array });
        break;
      case "event":
        await apiObject.removeEventPopupMultiple({ popup_array });
        break;
    }

    handleQueryChange("page", 1);
    getPopupList();
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    if (q !== "page") {
      query.page = 1;
    }
    if (q === "type") {
      query.filter = "now";
    }

    history.push("/popup?" + qs.stringify(query));
  }

  useEffect(() => {
    getPopupList();
  }, [query.type, query.filter, query.page]);

  return (
    <Box>
      <Box className={classes.table_header}>
        <Box>
          <Typography variant="h5" fontWeight="500" display="inline">
            팝업 목록
          </Typography>

          <Box display="inline-flex">
            {type_buttons.map((item, index) => {
              let is_cur_type = item.value === (query.type || "notice");
              return (
                <Button
                  key={index}
                  mr={1}
                  color={is_cur_type ? "primary" : undefined}
                  onClick={() => handleQueryChange("type", item.value)}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box>
          <Box display="inline-flex">
            {filter_buttons.map((item, index) => {
              let is_cur_filter = item.value === (query.filter || "now");
              return (
                <Button variant="text" onClick={() => handleQueryChange("filter", item.value)} key={index}>
                  <Typography fontWeight={is_cur_filter ? "700" : undefined}>{item.label}</Typography>
                </Button>
              );
            })}
          </Box>

          <Box>
            <Button color="primary" onClick={() => history.push(`/popup/add`)}>
              등록
            </Button>
            <Button ml={1} color="secondary" onClick={removePopups}>
              삭제
            </Button>
          </Box>
        </Box>
      </Box>

      <Box my={2}>
        <ColumnTable
          columns={query.filter === "stop" ? prev_popup_columns : cur_popup_columns}
          data={popupList}
          onRowClick={(row) => history.push(`/popup/${row.popup_gubun}/${row.popup_pk}`)}
          selection
          onSelectionChange={setSelectedPopup}
        />
      </Box>

      <Box position="relative" mt={6}>
        <Pagination page={query.page} setPage={handleQueryChange} />
      </Box>
    </Box>
  );
};
