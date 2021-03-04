import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { price, getFullImgURL } from "common";
import { apiObject } from "api";
import qs from "query-string";

import { Grid, Box, makeStyles, Select, MenuItem } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination, SearchBox, ImageBox, ExcelExportButton } from "components";

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

const excel_columns = [
  { label: "카테고리구분", value: "category_type", render: ({ category_yn }) => (category_yn ? "브랜드" : "제품군") },
  { label: "카테고리명", value: "category_name" },
  { label: "상품명", value: "product_name" },
  {
    label: "낱개당",
    value: "each_price",
    render: ({ each_price }) => price(each_price),
  },
  {
    label: "박스당",
    value: "box_price",
    render: ({ box_price }) => price(box_price),
  },
  {
    label: "카톤당",
    value: "carton_price",
    render: ({ carton_price }) => price(carton_price),
  },
];

export const ProductList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const query = qs.parse(location.search);
  const { control, watch } = useForm();

  const [productList, setProductList] = useState();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState();

  const product_list_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_yn }) => (category_yn ? "브랜드" : "제품군"), width: 120 },
    { title: "카테고리명", field: "category_name" },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "가격",
      render: ({ each_price, box_price, carton_price }) => (
        <>
          {each_price !== 0 && <p>{`낱개(${price(each_price)})`}</p>}
          {box_price !== 0 && <p>{`박스(${price(box_price)})`}</p>}
          {carton_price !== 0 && <p>{`카톤(${price(carton_price)})`}</p>}
        </>
      ),
    },
  ];

  async function getProductList() {
    let data = await apiObject.getProductList({
      ...query,
    });
    setProductList(data);
  }
  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});
    setCategoryList(data);
  }
  async function removeProduct() {
    if (!window.confirm("선택한 상품들을 삭제하시겠습니까?")) return;

    let product_array = [];
    selectedProducts.forEach((item) => {
      product_array.push({ product_pk: item.product_pk });
    });

    await apiObject.removeProduct({ product_array });
    getProductList();
  }

  function handleQueryChange(q, v) {
    if (q !== "page") {
      query.page = 1;
    }

    query[q] = v;
    history.push("/product/item?" + qs.stringify(query));
  }

  useEffect(() => {
    handleQueryChange("category_pk", "");
  }, [watch("category_type", "")]);

  useEffect(() => {
    getProductList();
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

        <Button ml={2} color="primary" onClick={() => history.push("/product/category")}>
          상품 카테고리 관리
        </Button>
      </Box>

      <Box className={classes.header}>
        <Box>
          <Controller
            as={
              <Select displayEmpty margin="dense">
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
              value={query.category_pk}
              onChange={(e) => handleQueryChange("category_pk", e.target.value)}
            >
              <MenuItem value="">카테고리 분류</MenuItem>
              {categoryList.categoryNormalList.map((item, index) => (
                <MenuItem value={item.category_pk} key={index}>
                  {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                </MenuItem>
              ))}
            </Select>
          )}

          <Box ml={2}>
            <Typography>등록 상품 수: {productList?.[0]?.total}</Typography>
          </Box>
        </Box>

        <Box>
          <Button color="primary" onClick={() => history.push("/product/item/add")}>
            등록
          </Button>
          <Button color="secondary" ml={2} onClick={removeProduct} disabled={!selectedProducts?.length}>
            삭제
          </Button>
        </Box>
      </Box>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={product_list_columns}
          data={productList}
          onRowClick={(row) => history.push(`/product/item/${row.product_pk}`)}
          selection
          onSelectionChange={setSelectedProducts}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <ExcelExportButton data={productList} columns={excel_columns} path="Product" />

        <Pagination
          page={query.page || 1}
          setPage={handleQueryChange}
          count={Math.ceil(productList?.[0]?.total / 10)}
        />

        <SearchBox defaultValue={query.search_word} onSearch={handleQueryChange} />
      </Grid>
    </Box>
  );
};
