import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

import dayjs from "dayjs";
import { price, getFullImgURL } from "common";

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
      marginRight: theme.spacing(1),
      width: theme.spacing(20),
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
  const { control, watch } = useForm();

  const [itemList, setItemList] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    search_category: "",
    category_pk: "",
  });

  const item_list_columns = [
    { title: "카테고리구분", render: ({ is_brand }) => (is_brand ? "브랜드" : "제품군") },
    { title: "제조사", field: "category_name" },
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <Avatar variant="square" src={getFullImgURL(thumb_img)} className={classes.logo_box} />
      ),
    },
    { title: "상품명", field: "product_name" },
    {
      title: "가격",
      render: ({ item_price }) => (
        <p style={{ whiteSpace: "pre-wrap" }}>
          {`낱개(${price(item_price?.piece) || "-"})
박스(${price(item_price?.box) || "-"})
카톤(${price(item_price?.carton) || "-"})`}
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
  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});

    setCategoryList(data);
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
    // console.log("listContext", listContext);
    getItemList();
  }, [listContext.page, listContext.search_category, listContext.category_pk]);

  useEffect(() => {
    // getItemList();
    getCategoryList();
  }, []);

  useEffect(() => {
    handleContextChange("category_pk", "");
  }, [watch("category_type", "")]);

  useEffect(() => {
    console.log(listContext.category_pk);
  }, [listContext.category_pk]);

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
          <Controller
            as={
              <Select displayEmpty margin="dense" variant="outlined">
                <MenuItem value="">카테고리 구분</MenuItem>
                <MenuItem value="B">브랜드</MenuItem>
                <MenuItem value="N">제품군</MenuItem>
              </Select>
            }
            control={control}
            name="category_type"
            defaultValue=""
          />

          {watch("category_type", "") === "B" && (
            <Select
              displayEmpty
              margin="dense"
              variant="outlined"
              value={listContext.category_pk}
              onChange={(e) => handleContextChange("category_pk", e.target.value)}
            >
              <MenuItem value="">카테고리 분류</MenuItem>
              {categoryList.categoryBrandList.map((item, index) => (
                <MenuItem value={item.category_pk} key={index}>
                  {item.category_name}
                </MenuItem>
              ))}
            </Select>
          )}
          {watch("category_type", "") === "N" && (
            <Select
              displayEmpty
              margin="dense"
              variant="outlined"
              value={listContext.category_pk}
              onChange={(e) => handleContextChange("category_pk", e.target.value)}
            >
              <MenuItem value="">카테고리 분류</MenuItem>
              {categoryList.categoryNormalList.map((item, index) => (
                <MenuItem value={item.category_pk} key={index}>
                  {item.category_name}
                </MenuItem>
              ))}
            </Select>
          )}

          <Box ml={2}>
            <Typography>등록 상품 수: {itemList?.[0]?.total}</Typography>
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
          onRowClick={(row) => history.push(`/product/item/${row.product_pk}`)}
          selection
          onSelectionChange={setSelectedItems}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination
          page={listContext.page}
          setPage={handleContextChange}
          count={Math.ceil(itemList?.[0]?.total / 10)}
        />

        <TextField
          name="search_word"
          variant="outlined"
          value={listContext.search_word}
          onChange={(e) => handleContextChange("search_word", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && getItemList()}
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
