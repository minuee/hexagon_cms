import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import dayjs from "dayjs";
import { price } from "common";

import { Grid, Box, makeStyles, TextField, InputAdornment, Avatar } from "@material-ui/core";
import { DescriptionOutlined, Search, EventNote } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";

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

  logo_box: {
    display: "inline-block",
    width: theme.spacing(12),
    height: theme.spacing(12),

    "& img": {
      objectFit: "contain",
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

const category_list_rows = [
  {
    category_no: 1,
    logo_img: "/image/arix.png",
    is_brand: true,
    category_name: "아릭스",
    exposure_priority: 1,
  },
  {
    category_no: 2,
    logo_img: "/image/dri-pak.png",
    is_brand: false,
    category_name: "드라이팍",
    exposure_priority: 3,
  },
  {
    category_no: 3,
    logo_img: "/image/la-corona.png",
    is_brand: false,
    category_name: "라코로나",
    exposure_priority: 4,
  },
  {
    category_no: 4,
    logo_img: "/image/cleanlogic.png",
    is_brand: true,
    category_name: "클린로직",
    exposure_priority: 2,
  },
  {
    category_no: 5,
    logo_img: "/image/tonkita.png",
    is_brand: false,
    category_name: "톤기타",
    exposure_priority: 5,
  },
];

export const CategoryList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [categoryList, setCategoryList] = useState();
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
  });

  const category_list_columns = [
    {
      field: "logo_img",
      title: "로고",
      render: ({ logo_img }) => <Avatar variant="square" src={logo_img} className={classes.logo_box} />,
    },
    { field: "category_type", title: "카테고리구분", render: ({ is_brand }) => (is_brand ? "브랜드" : "일반") },
    { field: "category_name", title: "카테고리명" },
    { field: "exposure_priority", title: "노출순위" },
  ];

  function handleDeleteCategorys() {
    console.log(selectedCategorys);
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
    setCategoryList(category_list_rows);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography display="inline" variant="h5" fontWeight="500">
            상품 카테고리
          </Typography>
          <Button ml={2} variant="contained" color="primary" onClick={() => history.push("/product/item")}>
            상품목록관리
          </Button>
        </Box>

        <Box>
          <Button variant="contained" onClick={() => history.push("/product/category/add")}>
            추가
          </Button>
          <Button ml={2} variant="contained" onClick={handleDeleteCategorys}>
            삭제
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={category_list_columns}
          data={categoryList}
          onRowClick={(row) => history.push(`/product/category/${row.category_no}`)}
          selection
          onSelectionChange={setSelectedCategorys}
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
