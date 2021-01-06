import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import dayjs from "dayjs";
import { price } from "common";

import { Grid, Box, makeStyles, TextField, InputAdornment, Avatar, Select, MenuItem } from "@material-ui/core";
import { DescriptionOutlined, Search, EventNote } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";

import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

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

const item_list_rows = [
  {
    item_no: 1,
    item_img: "/image/item_sample.png",
    is_brand: true,
    category_name: "아릭스",
    item_name: "철 수세미",
    item_price: 10000,
  },
  {
    item_no: 2,
    item_img: "/image/item_sample.png",
    is_brand: false,
    category_name: "드라이팍",
    item_name: "돌 수세미",
    item_price: 20000,
  },
  {
    item_no: 3,
    item_img: "/image/item_sample.png",
    is_brand: false,
    category_name: "톤키타",
    item_name: "고무 수세미",
    item_price: 30000,
  },
];

export const ItemList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [itemList, setItemList] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
    search_category: "",
  });

  const item_list_columns = [
    {
      field: "item_img",
      title: "상품 이미지",
      render: ({ item_img }) => <Avatar variant="square" src={item_img} className={classes.logo_box} />,
    },
    { field: "category_type", title: "카테고리구분", render: ({ is_brand }) => (is_brand ? "브랜드" : "일반") },
    { field: "category_name", title: "제조사" },
    { field: "item_name", title: "상품명" },
    { field: "item_price", title: "가격", render: ({ item_price }) => `${price(item_price)}원` },
  ];

  function handleDeleteItems() {
    console.log(selectedItems);
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
    setItemList(item_list_rows);
  }, []);

  return (
    <Box>
      <Typography display="inline" variant="h5" fontWeight="500">
        상품 목록
      </Typography>

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
            <MenuItem value="">전체상품 보기</MenuItem>
            <MenuItem value={1}>아릭스</MenuItem>
          </Select>

          <Button ml={2} variant="contained" color="primary" onClick={() => history.push("/product/category")}>
            상품 카테고리 관리
          </Button>
        </Box>

        <Box>
          <Button variant="contained" onClick={() => history.push("/product/item/add")}>
            추가
          </Button>
          <Button ml={2} variant="contained" onClick={handleDeleteItems}>
            삭제
          </Button>
        </Box>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={item_list_columns}
          data={itemList}
          onRowClick={(row) => history.push(`/product/item/${row.item_no}`)}
          selection
          onSelectionChange={setSelectedItems}
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
