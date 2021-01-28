import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
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

export const ItemList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);
  const { control, watch } = useForm();

  const [itemList, setItemList] = useState();
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryList, setCategoryList] = useState();
  const [searchWord, setSearchWord] = useState("");

  const item_list_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <Avatar variant="square" src={getFullImgURL(thumb_img)} className={classes.logo_box} />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_yn }) => (category_yn ? "브랜드" : "제품군"), width: 120 },
    { title: "카테고리명", field: "category_name" },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "가격",
      render: ({ each_price, box_price, carton_price }) => (
        <p style={{ whiteSpace: "pre-wrap" }}>
          {`낱개(${each_price ? price(each_price) : "-"})
박스(${box_price ? price(box_price) : "-"})
카톤(${carton_price ? price(carton_price) : "-"})`}
        </p>
      ),
    },
  ];

  async function getItemList() {
    let data = await apiObject.getItemList({
      ...query,
    });
    setItemList(data);
  }
  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});
    setCategoryList(data);
  }
  async function removeItems() {
    if (!window.confirm("선택한 상품들을 삭제하시겠습니까?")) return;

    let product_array = [];
    selectedItems.forEach((item) => {
      product_array.push({ product_pk: item.product_pk });
    });

    let resp = await apiObject.removeItems({ product_array });
    getItemList();
  }

  function handleQueryChange(q, v) {
    query[q] = v;
    history.push("/product/item?" + qs.stringify(query));
  }

  useEffect(() => {
    handleQueryChange("category_pk", "");
  }, [watch("category_type", "")]);

  useEffect(() => {
    getItemList();
  }, [query.page, query.search_word, query.category_pk]);

  useEffect(() => {
    getCategoryList();
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
              value={query.category_pk}
              onChange={(e) => handleQueryChange("category_pk", e.target.value)}
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
              value={query.category_pk}
              onChange={(e) => handleQueryChange("category_pk", e.target.value)}
            >
              <MenuItem value="">카테고리 분류</MenuItem>
              {categoryList.categoryNormalList.map((item, index) => (
                <MenuItem value={item.category_pk} key={index}>
                  {/* {item.category_name} */}
                  {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
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
          <Button ml={2} variant="contained" onClick={removeItems}>
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

        <Pagination page={query.page || 1} setPage={handleQueryChange} count={Math.ceil(itemList?.[0]?.total / 10)} />

        <TextField
          name="search_word"
          variant="outlined"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleQueryChange("search_word", searchWord)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => handleQueryChange("search_word", searchWord)}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
