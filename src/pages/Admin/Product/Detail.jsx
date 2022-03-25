import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import { price, getFullImgURL } from "common";

import {
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  TableRow,
  TableCell,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Dialog,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, Dropzone, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  category_wrapper: {
    "& > *": {
      display: "inline-block",
      width: theme.spacing(20),
      marginRight: theme.spacing(2),
    },
  },
  price_cell: {
    display: "flex",
    alignItems: "center",

    "& > :first-child": {
      display: "inline-block",
      marginRight: theme.spacing(2),
    },
    "& > :nth-child(2)": {
      display: "inline-flex",
      flexDirection: "column",

      "& > *": {
        width: theme.spacing(20),
      },
      "& > :nth-child(2)": {
        marginTop: theme.spacing(1),
      },
    },
  },
  modal_close_icon: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const ProductDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { product_pk } = useParams();
  const { member } = useSelector((state) => state.reducer);
  const { control, reset, setValue, watch, handleSubmit } = useForm();

  const [productData, setProductData] = useState();
  const [categoryList, setCategoryList] = useState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curSubstitute, setCurSubstitute] = useState();

  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});
    setCategoryList(data);
  }
  async function getProductDetail() {
    let data = await apiObject.getProductDetail({ product_pk });
    setProductData(data);

    reset({
      ...data,
      material: data.material || "",
      thumb_img: [],
      detail_img: [],
    });
    setValue("category_pk", data.category_pk);
    setValue("category2_pk", data.category2_pk);
    setValue("thumb_img", data.thumb_img);
    setValue("detail_img", data.detail_img);

    if (data.measure && data.measure !== "0") {
      setCurSubstitute({
        category_pk: data.measure_category_pk,
        each_price: data.measure_each_price,
        event_each_price: data.measure_event_each_price,
        product_name: data.measure_product_name,
        thumb_img: data.measure_thumb_img,
      });
    }
  }

  async function registProduct(form) {
    if (!form.thumb_img) {
      alert("대표이미지를 추가해주세요");
      return;
    } else if (!form.detail_img) {
      alert("상세이미지를 한 개 이상 추가해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 상품을 등록하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.thumb_img, page: "product" });
    if (!paths.length) return;
    form.thumb_img = paths?.[0];

    paths = await apiObject.uploadImageMultiple({ img_arr: form.detail_img, page: "product" });
    if (!paths.length) return;
    for (let i = 0; i < paths.length; i++) {
      form[`detail_img${i + 1}`] = paths[i];
    }

    await apiObject.registProduct({
      ...form,
      reg_member: member.member_pk,
    });
    history.push("/product/item");
  }
  async function modifyProduct(form) {
    if (!form.thumb_img) {
      alert("대표이미지를 추가해주세요");
      return;
    } else if (!form.detail_img) {
      alert("상세이미지를 한 개 이상 추가해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 상품을 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.thumb_img, page: "product" });
    if (!paths.length) return;
    form.thumb_img = paths?.[0];

    paths = await apiObject.uploadImageMultiple({ img_arr: form.detail_img, page: "product" });
    if (!paths.length) return;
    for (let i = 0; i < paths.length; i++) {
      form[`detail_img${i + 1}`] = paths[i];
    }

    await apiObject.modifyProduct({ ...form, product_pk, measure: curSubstitute?.product_pk });

    if (productData.is_soldout && !form.is_soldout && window.confirm("재입고 알림메시지를 발송하시겠습니까?")) {
      await apiObject.sendRestockMessage({
        product_name: form.product_name,
        product_pk,
        thumb_img: form.thumb_img,
      });
    }

    //await getProductDetail();
    history.push("/product/item");
  }

  useEffect(() => {
    setValue("category_pk", "");
  }, [watch("category_type", "B")]);

  useEffect(() => {
    setValue("category2_pk", "");
  }, [watch("category2_type", "B")]);

  useEffect(() => {
    getCategoryList();
    if (product_pk !== "add") {
      getProductDetail();
    }
  }, [product_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          상품 {product_pk === "add" ? "등록" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>카테고리1</TableCell>
          <TableCell>
            <Box className={classes.category_wrapper}>
              <Controller
                as={
                  <Select margin="dense" displayEmpty>
                    <MenuItem value="">카테고리선택</MenuItem>
                    <MenuItem value="B">브랜드</MenuItem>
                    <MenuItem value="N">제품군</MenuItem>
                  </Select>
                }
                name="category_type"
                control={control}
                defaultValue={""}
              />

              {watch("category_type", "") === "B" && (
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      <MenuItem value="">브랜드 선택</MenuItem>
                      {categoryList?.categoryBrandList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
              {watch("category_type", "") === "N" && (
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      <MenuItem value="">제품군 선택</MenuItem>
                      {categoryList?.categoryNormalList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>카테고리2</TableCell>
          <TableCell>
            <Box className={classes.category_wrapper}>
              <Controller
                as={
                  <Select margin="dense" displayEmpty>
                    <MenuItem value="">카테고리2선택</MenuItem>
                    <MenuItem value="B">브랜드</MenuItem>
                    <MenuItem value="N">제품군</MenuItem>
                  </Select>
                }
                name="category2_type"
                control={control}
                defaultValue={""}
              />

              {watch("category2_type", "") === "B" && (
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      <MenuItem value="">브랜드 선택</MenuItem>
                      {categoryList?.categoryBrandList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category2_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
              {watch("category2_type", "") === "N" && (
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      <MenuItem value="">제품군 선택</MenuItem>
                      {categoryList?.categoryNormalList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category2_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품명</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" fullWidth />}
              placeholder="상품명"
              name="product_name"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={3}>가격</TableCell>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>낱개당</Typography>
              <Box>
                <Controller
                  as={<TextField type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="가격 입력"
                  name="each_price"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>박스당</Typography>
              <Box>
                <Controller
                  as={<TextField type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="가격 입력"
                  name="box_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="수량 입력"
                  name="box_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>카톤당</Typography>
              <Box>
                <Controller
                  as={<TextField type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="가격 입력"
                  name="carton_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="수량 입력"
                  name="carton_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={3}>이벤트가격</TableCell>
          <TableCell>
            <Box display="flex">
              <Box className={classes.price_cell}>
                <Typography>낱개당</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">원</InputAdornment>,
                    }}
                    placeholder="가격 입력"
                    name="event_each_price"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
              <Box ml={4} className={classes.price_cell}>
                <Typography>이벤트 수량</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">개</InputAdornment>,
                    }}
                    placeholder="수량 입력"
                    name="event_each_stock"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box display="flex">
              <Box className={classes.price_cell}>
                <Typography>박스당</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">원</InputAdornment>,
                    }}
                    placeholder="가격 입력"
                    name="event_box_price"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                    }}
                    placeholder="수량 입력"
                    name="event_box_unit"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
              <Box ml={4} className={classes.price_cell}>
                <Typography>이벤트 수량</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">박스</InputAdornment>,
                    }}
                    placeholder="수량 입력"
                    name="event_box_stock"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box display="flex">
              <Box className={classes.price_cell}>
                <Typography>카톤당</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">원</InputAdornment>,
                    }}
                    placeholder="가격 입력"
                    name="event_carton_price"
                    control={control}
                    defaultValue=""
                  />
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                    }}
                    placeholder="수량 입력"
                    name="event_carton_unit"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
              <Box ml={4} className={classes.price_cell}>
                <Typography>이벤트 수량</Typography>
                <Box>
                  <Controller
                    as={<TextField type="number" size="small" />}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">카톤</InputAdornment>,
                    }}
                    placeholder="수량 입력"
                    name="event_carton_stock"
                    control={control}
                    defaultValue=""
                  />
                </Box>
              </Box>
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>재질</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" />}
              placeholder="재질명"
              name="material"
              control={control}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 대표 이미지</TableCell>
          <TableCell>
            <Dropzone
              mb={1}
              control={control}
              name="thumb_img"
              width="180px"
              ratio={1}
              minFiles={1}
              croppable={{ minWidth: 600 }}
            />
            <Typography>이미지는 가로x세로(720X720 pixel)이상을 권장드립니다.</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 설명 이미지</TableCell>
          <TableCell>
            <Dropzone mb={1} control={control} name="detail_img" width="120px" ratio={1} maxFiles={4} zoomable />
            <Typography color="textSecondary">
              상품에 대한 상세한 설명 또는 브랜드에 관한 소개를 4개까지 이미지로 업로드해주세요.
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>품절 여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="재고있음" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="품절" />
                </RadioGroup>
              )}
              name="is_soldout"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>

        {/* {productData?.is_soldout && !watch("is_soldout") && (
          <TableRow>
            <TableCell>재입고 알림 발송 여부</TableCell>
            <TableCell>
              <Controller
                render={({ value, onChange }) => (
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value}
                    label={<Typography variant="subtitle2">재입고 알림 발송</Typography>}
                  />
                )}
                control={control}
                name="is_newArrival_push"
                defaultValue={false}
              />
            </TableCell>
          </TableRow>
        )} */}
        {watch("is_soldout") && (
          <TableRow>
            <TableCell>대체상품</TableCell>
            <TableCell>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {!curSubstitute ? (
                  <Typography>대체상품을 선택해주세요</Typography>
                ) : (
                  <Box display="flex" alignItems="center">
                    <ImageBox
                      src={getFullImgURL(curSubstitute.thumb_img)}
                      display="inline-block"
                      width="60px"
                      height="60px"
                    />
                    <Box ml={1} mr={3}>
                      <Typography>{curSubstitute?.product_name}</Typography>
                      <Typography color="textSecondary">{price(curSubstitute?.each_price)}원(낱개)</Typography>
                    </Box>

                    <IconButton onClick={() => setCurSubstitute(null)}>
                      <Close />
                    </IconButton>
                  </Box>
                )}

                <Button size="large" onClick={() => setIsModalOpen(true)}>
                  상품검색
                </Button>
              </Box>
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell>적립금 사용가능여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="사용가능" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="사용불가" />
                </RadioGroup>
              )}
              name="can_point"
              control={control}
              defaultValue={true}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>적립제외 상품여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="적립대상" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="적립불가" />
                </RadioGroup>
              )}
              name="is_nonpoint"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품노출</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="노출" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="미노출" />
                </RadioGroup>
              )}
              name="use_yn"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {product_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registProduct)}>
            등록
          </Button>
        ) : (
          <Button color="primary" onClick={handleSubmit(modifyProduct)}>
            수정
          </Button>
        )}
      </Box>

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={setCurSubstitute}
        selectedDefault={curSubstitute}
      />
    </Box>
  );
};

const ProductModal = ({ open, onClose, onSelect, selectedDefault }) => {
  const classes = useStyles();

  const [selectedItem, setSelectedItem] = useState({});

  const [productData, setProductData] = useState();
  const [productList, setProductList] = useState();
  const [curCategory, setCurCategory] = useState("");

  const product_columns = [
    {
      title: "",
      render: (item) => (
        <Radio onClick={() => setSelectedItem(item)} checked={item.product_pk === selectedItem?.product_pk} />
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
      render: ({ each_price }) => price(each_price),
    },
    {
      title: "낱개당 이벤트 가격",
      render: ({ event_each_price }) => price(event_each_price),
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

  function handleOnSelect() {
    onSelect(selectedItem);
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
    setSelectedItem(selectedDefault);
  }

  useEffect(() => {
    setSelectedItem(selectedDefault);
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
            대체 상품
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
