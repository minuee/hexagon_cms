import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { apiObject } from "api";
import dayjs from "dayjs";
import qs from "query-string";

import { Grid, Box, makeStyles, TextField, InputAdornment, IconButton } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, SearchBox } from "components";

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

const banner_list_columns = [
  { title: "번호", field: "no", width: 80 },
  { title: "타입", field: "link_type_text", width: 120 },
  {
    title: "제목",
    render: ({ title }) => (title?.length > 20 ? title?.substring(0, 20) : title),
    cellStyle: { textAlign: "left" },
  },
  {
    title: "노출순서",
    field: "display_seq",
    width: 120,
  },
  {
    title: "등록일시",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD hh:mm"),
    width: 240,
  },
];

export const BannerList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [searchWord, setSearchWord] = useState("");
  const [bannerList, setBannerList] = useState();

  async function getBannerList() {
    let data = await apiObject.getBannerList({ ...query });

    setBannerList(data);
  }

  function handleAddBanner() {
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

        <Button color="primary" onClick={handleAddBanner}>
          등록
        </Button>
      </Grid>

      <Box mt={2} mb={3}>
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
      </Box>

      <Grid container className={classes.table_footer}>
        {/* <Button p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button> */}

        {/* <Pagination page={query.page || 1} setPage={handleQueryChange} /> */}

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
