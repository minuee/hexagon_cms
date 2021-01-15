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
    search_text: "",
    search_category: "",
  });

  const category_list_columns = [
    {
      title: "로고",
      render: ({ logo_img }) => <Avatar variant="square" src={logo_img} className={classes.logo_box} />,
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

  function handleDeleteCategorys() {
    console.log(selectedCategorys);
  }
  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  // useEffect(() => {
  //   console.log("listContext", listContext);
  // }, [listContext]);
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
            <MenuItem value="">전체 카테고리</MenuItem>
            <MenuItem value={"B"}>브랜드</MenuItem>
            <MenuItem value={"N"}>제품군</MenuItem>
          </Select>
        </Box>

        <Box>
          <Button variant="contained" onClick={() => history.push("/product/category/add")}>
            추가
          </Button>
          <Button ml={2} variant="contained" onClick={handleDeleteCategorys}>
            삭제
          </Button>
        </Box>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={category_list_columns}
          data={categoryList}
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
            name="search_text"
            variant="outlined"
            value={listContext.search_text}
            onChange={(e) => handleContextChange("search_text", e.target.value)}
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
