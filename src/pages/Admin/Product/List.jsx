import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price, getFullImgURL } from "common";
import { useQuery } from "hooks";

import { Grid, Box, makeStyles, Select, MenuItem } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable, ImageBox, ExcelExportButton, DnDList } from "components";

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

  dnd_container: {
    background: "#fff",

    "& th": {
      background: "#ddd",
      fontWeight: "700",
      textAlign: "center",
    },
    "& td": {
      textAlign: "center",
    },
  },
}));

export const ProductList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { query, updateQuery, getDataFunction, Pagination, SearchBox } = useQuery(location);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList, setProductList] = useState();
  const [categoryList, setCategoryList] = useState();
  const [isModify, setIsModify] = useState(false);

  const product_list_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군"), width: 120 },
    { title: "카테고리명", field: "category_name", width: 160 },
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

  async function getProductList(query) {
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
  async function modifyProductSequence(data) {
    if (!window.confirm("해당 카테고리의 상품 노출순서를 수정하시겠습니까?")) return;

    let product_array = [];
    data.forEach((item, index) => {
      product_array.push({
        product_pk: item.product_pk,
        display_seq: index + 1,
      });
    });

    await apiObject.modifyProductSequence({ category_pk: query.category_pk || "B", product_array });
    getProductList();
    setIsModify(false);
  }

  useEffect(() => {
    getCategoryList();
    getDataFunction(getProductList);
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

      {!isModify && (
        <Box className={classes.header}>
          <Box>
            <Select
              displayEmpty
              margin="dense"
              value={query.category_type || ""}
              onChange={(e) =>
                updateQuery({
                  category_type: e.target.value,
                  category_pk: "",
                })
              }
            >
              <MenuItem value="">카테고리 구분</MenuItem>
              <MenuItem value="B">브랜드</MenuItem>
              <MenuItem value="N">제품군</MenuItem>
            </Select>

            <Select
              displayEmpty
              margin="dense"
              value={query.category_pk || ""}
              onChange={(e) => updateQuery({ category_pk: e.target.value })}
            >
              <MenuItem value="">카테고리 분류</MenuItem>
              {(query.category_type || "") === "B" &&
                categoryList?.categoryBrandList.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {item.category_name}
                  </MenuItem>
                ))}
              {(query.category_type || "") === "N" &&
                categoryList?.categoryNormalList.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                  </MenuItem>
                ))}
            </Select>

            <Box ml={2}>
              <Typography>등록 상품 수: {productList?.[0]?.total}</Typography>
            </Box>
          </Box>

          <Box>
            {(query.category_pk || "") !== "" && <Button onClick={() => setIsModify(true)}>노출순서수정</Button>}
            <Button color="primary" ml={2} onClick={() => history.push("/product/item/add")}>
              등록
            </Button>
            <Button color="secondary" ml={2} onClick={removeProduct} disabled={!selectedProducts?.length}>
              삭제
            </Button>
          </Box>
        </Box>
      )}

      <Box mt={2} mb={3}>
        {isModify ? (
          <DnDList
            data={productList}
            columns={product_list_columns}
            className={classes.dnd_container}
            onModifyFinish={modifyProductSequence}
            onCancel={() => setIsModify(false)}
          />
        ) : (
          <ColumnTable
            columns={product_list_columns}
            data={productList}
            onRowClick={(row) => history.push(`/product/item/${row.product_pk}`)}
            selection
            onSelectionChange={setSelectedProducts}
          />
        )}
      </Box>

      {!isModify && (
        <Grid container className={classes.table_footer}>
          <ExcelExportButton path="product" />

          <Pagination total={productList?.[0]?.total} />

          <SearchBox />
        </Grid>
      )}
    </Box>
  );
};
