import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price, getFullImgURL } from "common";
import dayjs from "dayjs";
import qs from "query-string";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  InputAdornment,
  Avatar,
  Select,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import { DescriptionOutlined, Search, EventNote } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";

import { Typography, Button } from "components/materialui";
import { ColumnTable, SearchBox } from "components";
import { apiObject } from "api";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: theme.spacing(3),

    "& > *": {
      display: "flex",
      alignItems: "center",
    },

    "& .MuiInputBase-root": {
      width: theme.spacing(25),
      background: "#fff",
    },
  },

  logo_box: {
    display: "inline-block",
    width: "60px",
    height: "60px",

    "& img": {
      objectFit: "contain",
    },
  },

  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  search_section: {
    "& > *": {
      background: "#fff",
    },
  },
}));

export const CategoryList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [searchWord, setSearchWord] = useState("");

  const category_list_columns = [
    {
      title: "로고",
      render: ({ category_logo }) => (
        <Avatar variant="square" src={getFullImgURL(category_logo)} className={classes.logo_box} />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군"), width: 120 },
    {
      title: "카테고리명",
      render: (props) =>
        props.category_type === "N"
          ? `${props.depth1name} > ${props.depth2name} > ${props.depth3name}`
          : props.category_name,
    },
    // { field: "exposure_priority", title: "노출순위" },
  ];

  async function getCategoryList() {
    let data = await apiObject.getCategoryList({ ...query });

    setCategoryList(data);
    console.log(data);
  }
  async function removeCategories() {
    let category_array = [];
    selectedCategorys.forEach((item) => {
      category_array.push({
        category_pk: item.category_pk,
      });
    });

    if (window.confirm("선택한 카테고리들을 삭제하시겠습니까?")) {
      let resp = await apiObject.removeCategories({ category_array });
      console.log(resp);

      getCategoryList();
    }
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/product/category?" + qs.stringify(query));
  }

  useEffect(() => {
    getCategoryList();
  }, [query.search_word]);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h5" fontWeight="500">
          상품 카테고리
        </Typography>

        <Button ml={2} color="primary" onClick={() => history.push("/product/item")}>
          상품 목록 관리
        </Button>
      </Box>

      <Box className={classes.header}>
        <Box>
          <Select
            displayEmpty
            name="category_type"
            margin="dense"
            value={query.category_type || "B"}
            onChange={(e) => handleQueryChange("category_type", e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            }
          >
            <MenuItem value={"B"}>브랜드</MenuItem>
            <MenuItem value={"N"}>제품군</MenuItem>
          </Select>
        </Box>

        <Box>
          <Button color="primary" onClick={() => history.push("/product/category/add")}>
            등록
          </Button>
          <Button color="secondary" ml={2} onClick={removeCategories}>
            삭제
          </Button>
        </Box>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={category_list_columns}
          data={
            (query.category_type || "B") === "B" ? categoryList?.categoryBrandList : categoryList?.categoryNormalList
          }
          onRowClick={(row) =>
            history.push({
              pathname: `/product/category/${row.category_pk}`,
              state: {
                category_type: query?.category_type || "B",
              },
            })
          }
          selection
          onSelectionChange={setSelectedCategorys}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        {/* <Pagination page={listContext.page} setPage={handleContextChange} /> */}

        <Box className={classes.search_section}>
          <Box display="inline-block" mx={1} />

          <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
        </Box>
      </Grid>
    </Box>
  );
};
