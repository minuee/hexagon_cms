import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { apiObject } from "api";
import { useQuery } from "hooks";
import { price, getFullImgURL } from "common";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, Select, MenuItem, Dialog, IconButton, Checkbox } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, DnDList, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  header_buttons: {
    display: "inline-flex",
    alignItems: "center",

    "& > *": {
      marginleft: theme.spacing(1),
    },
  },
  table_footer: {
    display: "flex",
    justifyContent: "flex-end",
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
  modal_close_icon: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const RecommendList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, SearchBox } = useQuery(location);

  const [recommendList, setRecommendList] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control, register, reset, setValue, watch, handleSubmit } = useForm();
  const { fields, remove } = useFieldArray({
    name: "recommend_product",
    control: control,
  });

  const recommend_list_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "낱개당 가격",
      render: ({ each_price }) => `${price(each_price)}원`,
      width: 320,
    },
    {
      title: "상품 정보",
      render: ({ product_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
          정보
        </Button>
      ),
      width: 100,
    },
    {
      title: "",
      render: (row) => (
        <IconButton onClick={() => handleRemoveItem(row)}>
          <Close />
        </IconButton>
        // <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
        //   정보
        // </Button>
      ),
      width: 100,
    },
  ];

  async function getRecommendList() {
    let data = await apiObject.getRecommendList();
    setRecommendList(data);

    setValue("recommend_product", data);
  }
  async function modifyRecommendSequence(data) {
    if (!window.confirm("추천상품 노출순서를 수정하시겠습니까?")) return;

    let product_array = [];
    data.forEach((item, index) => {
      product_array.push({
        md_recom: data.length - index + 1,
        product_pk: item.product_pk,
      });
    });

    console.log(product_array);

    await apiObject.modifyRecommendSequence({ product_array });
    getRecommendList();
  }

  function handleUpdateTarget(selected_list) {
    let tmp = [];

    selected_list.forEach((item) => {
      let { id, ...others } = item;
      tmp.push(others);
    });

    setValue("recommend_product", tmp);
  }

  function handleRemoveItem(row) {
    let idx = fields.findIndex((item) => item.product_pk === row.product_pk);
    remove(idx);
  }

  useEffect(() => {
    getDataFunction(getRecommendList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          MD추천 상품관리
        </Typography>

        <Button color="primary" onClick={() => setIsModalOpen(true)}>
          상품선택
        </Button>
      </Grid>

      <Box mt={2} mb={3}>
        <DnDList
          data={fields}
          columns={recommend_list_columns}
          className={classes.dnd_container}
          onModifyFinish={modifyRecommendSequence}
          onCancel={() => history.push("/product/category")}
          disableButton
        />
      </Box>

      {/* <Grid container className={classes.table_footer}>
        <Button onClick={() => history.push("/product/category")}>취소</Button>
        <Button ml={2} color="primary" onClick={modifyRecommendSequence}>
          수정
        </Button>
      </Grid> */}

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleUpdateTarget}
        selectedDefault={fields}
      />
    </Box>
  );
};

const ProductModal = ({ open, onClose, onSelect, selectedDefault }) => {
  const classes = useStyles();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productData, setProductData] = useState();
  const [productList, setProductList] = useState();
  const [curCategory, setCurCategory] = useState("");

  const product_columns = [
    {
      title: "",
      render: (row) => (
        <Checkbox
          checked={selectedProducts.some((item) => item.product_pk === row.product_pk)}
          onClick={() => handleSelectRow(row)}
        />
      ),
      width: 80,
    },
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "낱개당 가격",
      render: ({ each_price }) => `${price(each_price)}원`,
      width: 320,
    },
    {
      title: "상품 정보",
      render: ({ product_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
          정보
        </Button>
      ),
      width: 100,
    },
  ];

  async function getProductList() {
    let data = await apiObject.getEventProductData({});
    setProductData(data);
    setProductList(data.product_list);
  }

  function handleSelectRow(row) {
    let tmp = [];
    if (selectedProducts.some((item) => item.product_pk === row.product_pk)) {
      tmp = selectedProducts.filter((item) => item.product_pk !== row.product_pk);
    } else {
      tmp = [...selectedProducts, row];
    }

    setSelectedProducts(tmp);
  }
  function handleOnSelect() {
    onSelect(selectedProducts);
    onClose();
  }
  function handleCategoryChange(category_pk) {
    setCurCategory(category_pk);

    if (!category_pk) {
      setProductList(productData.product_list);
    } else {
      let tmp = productData.product_list.filter((item) => item.category_pk == category_pk);
      setProductList(tmp);
    }
  }
  function handleEnter() {
    getProductList();
    setCurCategory("");
  }
  function handleClose() {
    onClose();
    setSelectedProducts(selectedDefault || []);
  }

  useEffect(() => {
    setSelectedProducts(selectedDefault || []);
  }, [selectedDefault]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
      onBackdropClick={handleClose}
      onEnter={handleEnter}
    >
      <IconButton className={classes.modal_close_icon} onClick={handleClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="700" display="inline">
            MD추천 상품
          </Typography>
        </Box>
        <Box mb={2} display="flex" justifyContent="space-between">
          <Select
            displayEmpty
            margin="dense"
            value={curCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            {productData?.category_list?.map((item, index) => (
              <MenuItem value={item.category_pk} key={index}>
                {item.label}
              </MenuItem>
            ))}
          </Select>

          <Button color="primary" onClick={handleOnSelect}>
            선택
          </Button>
        </Box>

        <ColumnTable columns={product_columns} data={productList} />
      </Box>
    </Dialog>
  );
};
