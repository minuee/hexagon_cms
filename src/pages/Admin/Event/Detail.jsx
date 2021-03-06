import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { price, getFullImgURL } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

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
  Checkbox,
} from "@material-ui/core";
import { EventNote, HighlightOff, Close } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, ImageBox, Dropzone } from "components";

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
  const { fields, remove } = useFieldArray({
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
      event_img: [],
      event_product: [],
    });

    let tmp = [];
    data.product_array.forEach((item) => {
      tmp.push(item);
    });
    setValue("event_product", tmp);    
    setValue("event_img", [{ file: null, path: data?.event_img }]);
  }
  async function registEvent(form) {
    if (!form.event_product) {
      alert("????????? ????????? ??????????????????");
      return;
    }else if (!form.event_img) {
      alert("????????? ???????????? ??????????????????");
      return;
    } else if (!window.confirm("????????? ????????? ???????????? ?????????????????????????")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.event_img, page: "event" });
    if (!paths.length) return;
    form.event_img = paths?.[0];
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
      alert("????????? ????????? ??????????????????");
      return;
    }else if (!form.event_img) {
      alert("????????? ???????????? ??????????????????");
      return;
    } else if (!window.confirm("????????? ????????? ???????????? ?????????????????????????")) {
      return;
    }

    
    let paths = await apiObject.uploadImageMultiple({ img_arr: form.event_img, page: "event" });
    console.log('paths ',paths )
    if (!paths.length) return;
    form.event_img = paths?.[0];
  
    console.log('form.event_img ',form.event_img )
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
  async function haltEvent() {
    if (!window.confirm("????????? ???????????? ????????????????????????????")) return;

    await apiObject.haltEvent({ event_pk });
    getEventDetail();
  }
  async function removeEvent() {
    if (!window.confirm("?????? ???????????? ?????????????????????????")) return;

    await apiObject.removeEvent({ event_pk });
    history.push("/event");
  }

  function handleUpdateTarget(selected_list) {
    let tmp = [];

    selected_list.forEach((item) => {
      let { id, ...others } = item;
      tmp.push(others);
    });

    setValue("event_product", tmp);
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
          ????????? {event_pk === "add" ? "??????" : "??????"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>????????? ??????</TableCell>
          <TableCell>
            <TextField
              inputRef={register({ required: true })}
              size="small"
              name="title"
              placeholder="?????? ??????"
              disabled={isTerminated}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>????????? ??????</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel
                    value="LIMIT"
                    control={<Radio color="primary" />}
                    label="????????????"
                    disabled={isTerminated}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="TERM"
                    control={<Radio color="primary" />}
                    label="?????????????????????"
                    disabled={isTerminated}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="SALE"
                    control={<Radio color="primary" />}
                    label="???????????????"
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
          <TableCell>???????????????</TableCell>
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
                    maxDate={watch("end_dt") || dayjs.unix(9999999999)}
                    disablePast
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
                        minDate={watch("start_dt") || dayjs.unix(0)}
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
          <TableCell>????????? ?????????</TableCell>
          <TableCell>
            <Dropzone mb={1} control={control} name="event_img" width="120px" ratio={1} maxFiles={1} zoomable />
            <Typography>???????????? ??????x??????(1024X450 pixel)????????? ??????????????????.</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>????????? ?????? ??????</TableCell>
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
                          <Typography fontWeight="500">{price(value?.event_each_price)}???</Typography>
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
                ?????? ??????
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      </RowTable>

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleUpdateTarget}
        selectedDefault={fields}
      />

      <Box mt={4} textAlign="center">
        <Button mr={2} onClick={() => history.push("/event")}>
          ??????
        </Button>

        {event_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registEvent)}>
            ??????
          </Button>
        ) : (
          <>
            {!isTerminated && (
              <>
                <Button mr={2} color="primary" onClick={handleSubmit(modifyEvent)}>
                  ??????
                </Button>
                <Button mr={2} style={{ background: "#333", color: "#fff" }} onClick={haltEvent}>
                  ??????
                </Button>
              </>
            )}
            <Button color="secondary" onClick={removeEvent}>
              ??????
            </Button>
          </>
        )}
      </Box>
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
      title: "?????? ?????????",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "?????????", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "????????? ???????????????",
      render: ({ each_price, event_each_price }) => (
        <Typography fontWeight="500">
          <s style={{ fontSize: "14px", color: "#888" }}>{price(each_price)}</s>
          &nbsp;{price(event_each_price)}
        </Typography>
      ),
      width: 320,
    },
    {
      title: "?????? ??????",
      render: ({ product_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
          ??????
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
            ????????? ?????? ??????
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
            ??????
          </Button>
        </Box>

        {/* <Box className={classes.product_list_header}>
          <Box>
            <Controller
              as={
                <Select displayEmpty margin="dense">
                  <MenuItem value="">???????????? ??????</MenuItem>
                  <MenuItem value="B">?????????</MenuItem>
                  <MenuItem value="N">?????????</MenuItem>
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
                <MenuItem value="">???????????? ??????</MenuItem>
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
                <MenuItem value="">???????????? ??????</MenuItem>
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

        <ColumnTable columns={product_columns} data={productList} />

        {/* <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(productList?.[0]?.total / 10)}
          />
          <Button color="primary" onClick={handleOnSelect}>
            ??????
          </Button>
        </Box> */}
      </Box>
    </Dialog>
  );
};
