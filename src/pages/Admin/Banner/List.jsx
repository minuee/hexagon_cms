import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable, SearchBox, DnDList } from "components";

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

  dnd_container: {
    background: "#fff",

    "& th": {
      background: "#ddd",
      fontWeight: "700",
      textAlign: "center",
    },
    "& td": {
      textAlign: "center",
    },
  },
}));

const banner_list_columns = [
  {
    title: "노출순서",
    field: "display_seq",
    width: 100,
  },
  { title: "타입", field: "link_type_text", width: 120 },
  {
    title: "제목",
    render: ({ title }) => (title?.length > 30 ? `${title?.substring(0, 30)}...` : title),
    cellStyle: { textAlign: "left", width: "calc(max(100vw, 1280px) - 874px)" },
  },
  {
    title: "등록일시",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD HH:mm"),
    width: 240,
  },
];

export const BannerList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [bannerList, setBannerList] = useState();
  const [isModify, setIsModify] = useState(false);

  async function getBannerList() {
    let data = await apiObject.getBannerList({ ...query });
    setBannerList(data);
  }
  async function modifyExposureSequence(data) {
    if (!window.confirm("배너 노출순서를 수정하시겠습니까?")) return;

    let banner_array = [];
    data.forEach((item, index) => {
      banner_array.push({
        banner_pk: item.banner_pk,
        display_seq: index + 1,
      });
    });

    await apiObject.modifyBannerSequence({ banner_array });
    getBannerList();
    setIsModify(false);
  }

  function registBanner() {
    if (bannerList?.length >= 10) {
      window.alert("배너는 10개까지만 등록이 가능합니다");
    } else {
      history.push("/banner/add");
    }
  }
  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/banner?" + qs.stringify(query));
  }

  useEffect(() => {
    getBannerList();
  }, [query.search_word]);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          배너 목록
        </Typography>

        {!isModify && (
          <Box>
            <Button disabled={bannerList?.length <= 1} onClick={() => setIsModify(true)}>
              노출순서 수정
            </Button>
            <Button ml={2} color="primary" onClick={registBanner}>
              등록
            </Button>
          </Box>
        )}
      </Grid>

      <Box mt={2} mb={3}>
        {isModify ? (
          <DnDList
            data={bannerList}
            columns={banner_list_columns}
            className={classes.dnd_container}
            onModifyFinish={modifyExposureSequence}
            onCancel={() => setIsModify(false)}
          />
        ) : (
          <ColumnTable
            columns={banner_list_columns}
            data={bannerList}
            onRowClick={(row) =>
              history.push({
                pathname: `/banner/${row.banner_pk}`,
                state: {
                  link_type: row.link_type,
                  inlink_type: row.inlink_type,
                },
              })
            }
          />
        )}
      </Box>

      <Grid container className={classes.table_footer}>
        {!isModify && <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />}
      </Grid>
    </Box>
  );
};
