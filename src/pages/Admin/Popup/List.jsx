import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { getFullImgURL } from "common";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable, ImageBox } from "components";

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
  const { query, updateQuery, getDataFunction, Pagination, FilterBox } = useQuery(location);

  const [popupList, setPopupList] = useState();
  const [selectedPopup, setSelectedPopup] = useState([]);

  const cur_popup_columns = [
    {
      title: "이미지",
      render: ({ img_url }) => (
        <ImageBox src={getFullImgURL(img_url)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    {
      title: "종류",
      render: ({ popup_type }) => (popup_type === "Layer" ? "레이어" : "전체화면"),
      width: 120,
    },
    {
      title: "대상",
      render: ({ inlink_type }) => (inlink_type === "EVENT" ? "이벤트" : "상품"),
      width: 120,
      hidden: query.type !== "event",
    },
    { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "시작 시간",
      render: ({ start_dt }) => `${dayjs.unix(start_dt).format("YYYY-MM-DD HH:mm")}부터 적용`,
      width: 240,
    },
  ];
  const prev_popup_columns = [
    {
      title: "이미지",
      render: ({ img_url }) => (
        <ImageBox src={getFullImgURL(img_url)} display="inline-block" width="60px" height="60px" />
      ),
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
        `${dayjs.unix(start_dt).format("YYYY-MM-DD HH:mm")} ~
      ${dayjs.unix(end_dt).format("YYYY-MM-DD HH:mm")}`,
      width: 400,
    },
  ];

  async function getPopupList(query) {
    let data;

    if (query?.type === "event") {
      if (query?.filter_item === "stop") {
        data = await apiObject.getPrevEventPopupList({ ...query });
      } else {
        data = await apiObject.getCurEventPopupList({ ...query });
      }
    } else {
      if (query?.filter_item === "stop") {
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

    updateQuery({ page: 1 });
    getPopupList();
  }

  useEffect(() => {
    getDataFunction(getPopupList);
  }, []);

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
                  onClick={() => {
                    updateQuery({
                      type: item.value,
                      filter_item: "now",
                    });
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box>
          <Box display="inline-flex">
            <FilterBox type="filter" button_list={filter_buttons} default_item="now" />
          </Box>

          <Box>
            <Button color="primary" onClick={() => history.push(`/popup/${query.type || "notice"}/regist`)}>
              등록
            </Button>
            <Button ml={1} color="secondary" onClick={removePopups} disabled={!selectedPopup?.length}>
              삭제
            </Button>
          </Box>
        </Box>
      </Box>

      <Box my={2}>
        <ColumnTable
          columns={query.filter_item === "stop" ? prev_popup_columns : cur_popup_columns}
          data={popupList}
          onRowClick={(row) =>
            history.push({
              pathname: `/popup/${row.popup_gubun}/${row.popup_pk}`,
              state: {
                inlink_type: row.inlink_type,
              },
            })
          }
          selection
          onSelectionChange={setSelectedPopup}
        />
      </Box>

      <Box position="relative" mt={6}>
        <Pagination total={popupList?.[0]?.total} />
      </Box>
    </Box>
  );
};
