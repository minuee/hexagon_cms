import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import dayjs from "dayjs";
import { price } from "common";

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
import { ColumnTable, Pagination } from "components";
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

export const CategoryList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [categoryList, setCategoryList] = useState();
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    search_category: "B",
  });

  const category_list_columns = [
    {
      title: "로고",
      render: ({ category_logo }) => <Avatar variant="square" src={category_logo} className={classes.logo_box} />,
    },
    { title: "카테고리구분", render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군") },
    { title: "카테고리명", field: "category_name" },
    // { field: "exposure_priority", title: "노출순위" },
  ];

  async function getCategoryList() {
    let data = await apiObject.getCategoryList({ ...listContext });

    setCategoryList(data);
    console.log(data);
  }
  async function removeCategorys() {
    let category_array = [];
    selectedCategorys.forEach((item) => {
      category_array.push({
        category_pk: item.category_pk,
      });
    });

    if (window.confirm("선택한 카테고리들을 삭제하시겠습니까?")) {
      let resp = await apiObject.removeCategorys({ category_array });
      console.log(resp);

      getCategoryList();
    }
  }

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h5" fontWeight="500">
          상품 카테고리
        </Typography>

        <Button ml={2} variant="contained" color="primary" onClick={() => history.push("/product/item")}>
          상품 목록 관리
        </Button>
      </Box>

      <Box className={classes.header}>
        <Box>
          <Select
            displayEmpty
            name="search_category"
            variant="outlined"
            value={listContext.search_category}
            onChange={(e) => handleContextChange("search_category", e.target.value)}
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
          <Button variant="contained" onClick={() => history.push("/product/category/add")}>
            추가
          </Button>
          <Button ml={2} variant="contained" onClick={removeCategorys}>
            삭제
          </Button>
        </Box>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={category_list_columns}
          data={
            listContext.search_category === "B" ? categoryList?.categoryBrandList : categoryList?.categoryNormalList
          }
          onRowClick={(row) => history.push(`/product/category/${row.category_pk}`)}
          selection
          onSelectionChange={setSelectedCategorys}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        {/* <Pagination page={listContext.page} setPage={handleContextChange} /> */}

        <Box className={classes.search_section}>
          <Box display="inline-block" mx={1} />

          <TextField
            name="search_word"
            variant="outlined"
            value={listContext.search_word}
            onChange={(e) => handleContextChange("search_word", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getCategoryList()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={getCategoryList}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Grid>
    </Box>
  );
};
