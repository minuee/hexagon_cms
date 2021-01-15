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

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

export const ItemList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [itemList, setItemList] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    search_category: "",
  });

  const item_list_columns = [
    { title: "카테고리구분", render: ({ is_brand }) => (is_brand ? "브랜드" : "제품군") },
    { title: "제조사", field: "category_name" },
    {
      title: "상품 이미지",
      render: ({ item_img }) => <Avatar variant="square" src={item_img} className={classes.logo_box} />,
    },
    { title: "상품명", field: "item_name" },
    {
      title: "가격",
      render: ({ item_price }) => (
        <p style={{ whiteSpace: "pre-wrap" }}>
          {`낱개(${price(item_price.piece) || "-"})
박스(${price(item_price.box) || "-"})
카톤(${price(item_price.carton) || "-"})`}
        </p>
      ),
    },
  ];

  async function getItemList() {
    let data = await apiObject.getItemList({
      ...listContext,
    });

    setItemList(data);
    console.log(data);
  }

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
    getItemList();
  }, []);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          상품 목록
        </Typography>

        <Button ml={2} variant="contained" color="primary" onClick={() => history.push("/product/category")}>
          상품 카테고리 관리
        </Button>
      </Box>

      <Box className={classes.header}>
        <Box>
          <Select
            displayEmpty
            name="search_category_type"
            margin="dense"
            variant="outlined"
            value={listContext.search_category}
            onChange={(e) => handleContextChange("search_category_type", e.target.value)}
          >
            <MenuItem value="">카테고리 구분</MenuItem>
            <MenuItem value="brand">브랜드</MenuItem>
            <MenuItem value="product_group">제품군</MenuItem>
          </Select>

          <Box mx={1} />

          <Select
            displayEmpty
            name="search_category_name"
            margin="dense"
            variant="outlined"
            value={listContext.search_category}
            onChange={(e) => handleContextChange("search_category_name", e.target.value)}
          >
            <MenuItem value="">카테고리 선택</MenuItem>
            <MenuItem value={1}>아릭스</MenuItem>
            <MenuItem value={2}>드라이팍</MenuItem>
            <MenuItem value={3}>라코로나</MenuItem>
          </Select>

          <Box ml={2}>
            <Typography>등록 상품 수: {222}</Typography>
          </Box>
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
          name="search_word"
          variant="outlined"
          value={listContext.search_word}
          onChange={(e) => handleContextChange("search_word", e.target.value)}
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
