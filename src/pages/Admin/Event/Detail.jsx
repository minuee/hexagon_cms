import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { price, getFullImgURL } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";
import _ from "lodash";

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
  Dialog,
  IconButton,
} from "@material-ui/core";
import { EventNote, HighlightOff, Close } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  datetimepicker_wrapper: {
    display: "flex",
    alignItems: "center",

    "& > .MuiFormControl-root": {
      cursor: "pointer",
      display: "inline-block",
      background: "#f5f5f5",
    },
  },
  item_wrapper: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),

    "& > *": {
      marginRight: theme.spacing(2),
    },
  },

  product_list_header: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& > *": {
      display: "inline-block",
    },
    "& > :first-child": {
      "& > *": {
        marginRight: theme.spacing(2),
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

export const EventDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { event_pk } = useParams();
  const { control, register, reset, setValue, watch, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "event_product",
    control: control,
  });

  const [isTerminated, setIsTerminated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getEventDetail() {
    let data = await apiObject.getEventDetail({ event_pk });
    setIsTerminated(data.end_dt && data.end_dt < dayjs().unix());

    reset({
      ...data,
      start_dt: dayjs.unix(data.start_dt),
      end_dt: data.end_dt ? dayjs.unix(data.end_dt) : null,
      event_product: [],
    });

    let tmp = [];
    data.product_array.forEach((item) => {
      tmp.push(item);
    });
    setValue("event_product", tmp);
  }
  async function registEvent(form) {
    if (!form.event_product) {
      alert("이벤트 상품을 선택해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 이벤트를 등록하시겠습니까?")) {
      return;
    }

    form.product = [];
    form.event_product.forEach((item) => {
      form.product.push({
        product_pk: item.product_pk,
      });
    });

    form.start_dt = form.start_dt.unix();
    form.end_dt = form.end_dt?.unix();

    await apiObject.registEvent({ ...form });
    history.push("/event");
  }
  async function modifyEvent(form) {
    if (!form.event_product) {
      alert("이벤트 상품을 선택해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 이벤트를 수정하시겠습니까?")) {
      return;
    }

    form.product = [];
    form.event_product.forEach((item) => {
      form.product.push({
        product_pk: item.product_pk,
      });
    });

    form.start_dt = form.start_dt.unix();
    form.end_dt = form.end_dt?.unix();

    await apiObject.modifyEvent({ event_pk, ...form, is_halt: false });
    getEventDetail();
  }
  async function haltEvent(form) {
    if (!window.confirm("선택한 이벤트를 중지시키시겠습니까?")) return;

    form.product = [];
    form.event_product.forEach((item) => {
      form.product.push({
        product_pk: item.product_pk,
      });
    });

    form.start_dt = form.start_dt.unix();
    form.end_dt = dayjs().unix();

    await apiObject.modifyEvent({ event_pk, ...form, is_halt: true });
    getEventDetail();
  }
  async function removeEvent() {
    if (!window.confirm("현재 이벤트를 삭제하시겠습니까?")) return;

    await apiObject.removeEvent({ event_pk });
    history.push("/event");
  }

  function handleAppendProduct(selected_list) {
    let tmp = _.differenceBy(selected_list, fields, "product_pk");
    tmp.forEach((item) => {
      item.amount = "";
    });

    append(tmp);
  }

  useEffect(() => {
    if (event_pk !== "add") {
      getEventDetail();
    }
  }, [event_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          이벤트 {event_pk === "add" ? "추가" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>이벤트 제목</TableCell>
          <TableCell>
            <TextField
              inputRef={register({ required: true })}
              size="small"
              name="title"
              placeholder="제목 입력"
              disabled={isTerminated}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이벤트 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel
                    value="LIMIT"
                    control={<Radio color="primary" />}
                    label="한정특가"
                    disabled={isTerminated}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="TERM"
                    control={<Radio color="primary" />}
                    label="기간할인이벤트"
                    disabled={isTerminated}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="SALE"
                    control={<Radio color="primary" />}
                    label="할인이벤트"
                    disabled={isTerminated}
                  />
                </RadioGroup>
              }
              name="event_gubun"
              control={control}
              defaultValue="LIMIT"
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이벤트일정</TableCell>
          <TableCell>
            <Box className={classes.datetimepicker_wrapper}>
              <Controller
                render={({ ref, ...props }) => (
                  <DateTimePicker
                    {...props}
                    inputRef={ref}
                    format={`YYYY.MM.DD   HH:mm`}
                    minutesStep={10}
                    inputVariant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EventNote />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                    disabled={isTerminated}
                  />
                )}
                name={"start_dt"}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />

              {watch("event_gubun", "") === "TERM" && (
                <>
                  <Box mx={2} display="inline">
                    <Typography display="inline">~</Typography>
                  </Box>

                  <Controller
                    render={({ ref, ...props }) => (
                      <DateTimePicker
                        {...props}
                        inputRef={ref}
                        format={`YYYY.MM.DD   HH:mm`}
                        minutesStep={10}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <EventNote />
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                        disabled={isTerminated}
                      />
                    )}
                    name={"end_dt"}
                    control={control}
                    defaultValue={null}
                    rules={{ required: true }}
                  />
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이벤트 상품 선택</TableCell>
          <TableCell>
            <Box>
              {fields.map((item, index) => (
                <Box className={classes.item_wrapper} key={item.id}>
                  <Controller
                    render={({ value }) => (
                      <>
                        <ImageBox src={getFullImgURL(value.thumb_img)} width="120px" height="80px" />
                        <Box>
                          <Typography fontWeight="500">{value.product_name}</Typography>
                          <Typography fontWeight="500">{price(value?.event_each_price)}원</Typography>
                        </Box>
                      </>
                    )}
                    control={control}
                    name={`event_product.[${index}]`}
                    defaultValue={item}
                  />
                  {!isTerminated && (
                    <IconButton onClick={() => remove(index)}>
                      <HighlightOff />
                    </IconButton>
                  )}
                </Box>
              ))}
              <Button size="large" onClick={() => setIsModalOpen(true)} disabled={isTerminated}>
                상품 검색
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      </RowTable>

      <ProductModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSelect={handleAppendProduct} />

      <Box mt={4} textAlign="center">
        <Button mr={2} onClick={() => history.push("/event")}>
          목록
        </Button>

        {event_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registEvent)}>
            등록
          </Button>
        ) : (
          <>
            {!isTerminated && (
              <>
                <Button mr={2} color="primary" onClick={handleSubmit(modifyEvent)}>
                  수정
                </Button>
                <Button mr={2} style={{ background: "#333", color: "#fff" }} onClick={handleSubmit(haltEvent)}>
                  중지
                </Button>
              </>
            )}
            <Button color="secondary" onClick={removeEvent}>
              삭제
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

const ProductModal = ({ open, onClose, onSelect }) => {
  // const [categoryList, setCategoryList] = useState([]);
  // const [productList, setProductList] = useState();
  // const [listContext, setListContext] = useState({
  //   page: 1,
  //   search_word: "",
  // });
  const classes = useStyles();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productData, setProductData] = useState();
  const [productList, setProductList] = useState();
  const [curCategory, setCurCategory] = useState("");

  const product_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "가격",
      render: ({ each_price, event_each_price }) => (
        <Typography fontWeight="500">
          낱개 &#40;<s style={{ fontSize: "14px", color: "#888" }}>{price(each_price)}</s> &gt;{" "}
          {price(event_each_price)}&#41;원
        </Typography>
      ),
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

  function handleCategoryChange(category_pk) {
    setCurCategory(category_pk);

    if (!category_pk) {
      setProductList(productData.product_list);
    } else {
      let tmp = productData.product_list.filter((item) => item.category_pk == category_pk);
      setProductList(tmp);
    }
  }
  function handleOnSelect() {
    onSelect(selectedProducts);
    onClose();
  }

  // function handleContextChange(name, value) {
  //   let tmp = {
  //     ...listContext,
  //     [name]: value,
  //   };
  //   if (name != "page") {
  //     tmp.page = 1;
  //   }

  //   setListContext(tmp);
  // }

  function handleEnter() {
    getProductList();
    setCurCategory("");
    // setListContext({
    //   page: 1,
    //   search_word: "",
    // });
  }

  // useEffect(() => {
  //   handleContextChange("category_pk", "");
  // }, [watch("category_type")]);
  // useEffect(() => {
  //   getProductList();
  // }, [listContext]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleEnter}>
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="700" display="inline">
            이벤트 적용 상품
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

        {/* <Box className={classes.product_list_header}>
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
                value={listContext?.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">카테고리 분류</MenuItem>
                {categoryList.categoryBrandList?.map((item, index) => (
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
                value={listContext?.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">카테고리 분류</MenuItem>
                {categoryList.categoryNormalList?.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>

          <SearchBox defaultValue={listContext?.search_word} onSearch={handleContextChange} />
        </Box> */}

        <ColumnTable columns={product_columns} data={productList} selection onSelectionChange={setSelectedProducts} />

        {/* <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(productList?.[0]?.total / 10)}
          />
          <Button color="primary" onClick={handleOnSelect}>
            선택
          </Button>
        </Box> */}
      </Box>
    </Dialog>
  );
};
