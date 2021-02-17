import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { price, getFullImgURL } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";
import _ from "lodash";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  Dialog,
  Tabs,
  Tab,
  IconButton,
} from "@material-ui/core";
import { EventNote, Search, HighlightOff } from "@material-ui/icons";
import { DatePicker, TimePicker, DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { Pagination, ColumnTable, RowTable, Dropzone } from "components";
import { ImageBox } from "components/ImageBox";

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
}));

export const EventDetail = () => {
  const { event_pk } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { control, register, reset, setValue, watch, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "event_product",
    control: control,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function getEventDetail() {
    let data = await apiObject.getEventDetail({ event_pk });

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
    // setEventDetail(data);
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

    await apiObject.modifyEvent({ event_pk, ...form });
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
            <TextField inputRef={register({ required: true })} size="small" name="title" placeholder="제목 입력" />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이벤트 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="LIMIT" control={<Radio color="primary" />} label="한정특가" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value="TERM" control={<Radio color="primary" />} label="기간할인이벤트" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value="SALE" control={<Radio color="primary" />} label="할인이벤트" />
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
                          <Typography fontWeight="500">{price(value.event_each_price)}원</Typography>
                        </Box>
                      </>
                    )}
                    control={control}
                    name={`event_product.[${index}]`}
                    defaultValue={item}
                  />
                  <IconButton onClick={() => remove(index)}>
                    <HighlightOff />
                  </IconButton>

                  {/* {watch("event_gubun", "LIMIT") === "LIMIT" && (
                    <TextField
                      value={value.amount}
                      onChange={(e) =>
                        onChange({
                          ...value,
                          amount: e.target.value,
                        })
                      }
                      placeholder="수량 입력"
                      size="small"
                      type="number"
                    />
                  )} */}
                </Box>
              ))}
              <Button size="large" onClick={() => setIsModalOpen(true)}>
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
            <Button color="primary" onClick={handleSubmit(modifyEvent)}>
              수정
            </Button>
            <Button ml={2} color="primary" onClick={removeEvent}>
              삭제
            </Button>
            {/* {!eventDetail?.terminate_yn && (
              <Button ml={2} color="secondary" onClick={() => console.log("termination")}>
                마감
              </Button>
            )} */}
          </>
        )}
      </Box>
    </Box>
  );
};

const ProductModal = ({ open, onClose, onSelect }) => {
  const classes = useStyles();
  const { control, register, watch } = useForm();

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
  });

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
      render: ({ each_price, box_price, carton_price }) => (
        <>
          {each_price !== 0 && <p>{`낱개(${price(each_price)})`}</p>}
          {box_price !== 0 && <p>{`박스(${price(box_price)})`}</p>}
          {carton_price !== 0 && <p>{`카톤(${price(carton_price)})`}</p>}
        </>
      ),
      width: 200,
    },
  ];

  async function getProductList() {
    let data = await apiObject.getItemList({
      ...listContext,
    });
    setProductList(data);
  }
  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});
    setCategoryList(data);
  }

  function handleOnSelect() {
    onSelect(selectedProducts);
    onClose();
  }

  function handleContextChange(name, value) {
    // let next_context = {
    //   ...listContext,
    //   [name]: value,
    // };

    // if (name !== "page") {
    //   next_context.page = 1;
    // }

    // console.log(next_context);
    // setListContext(next_context);
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  function handleEnter() {
    getCategoryList();
    setListContext({
      page: 1,
      search_word: "",
    });
  }

  useEffect(() => {
    handleContextChange("category_pk", "");
  }, [watch("category_type")]);
  useEffect(() => {
    getProductList();
  }, [listContext.page, listContext.category_pk]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleEnter}>
      <Box p={3} height="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          이벤트 적용 상품
        </Typography>

        <Box className={classes.product_list_header}>
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
                value={listContext?.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">카테고리 분류</MenuItem>
                {categoryList.categoryNormalList.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>

          <TextField
            size="small"
            placeholder="상품검색"
            value={listContext.search_word}
            onChange={(e) => handleContextChange("search_word", e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && getProductList()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={getProductList}>
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <ColumnTable columns={product_columns} data={productList} selection onSelectionChange={setSelectedProducts} />

        <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(productList?.[0]?.total / 10)}
          />
          <Button color="primary" onClick={handleOnSelect}>
            선택
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
