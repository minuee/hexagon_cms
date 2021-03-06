import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
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
} from "@material-ui/core";
import { EventNote, Close } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, Pagination, SearchBox, Dropzone, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  datetimepicker: {
    display: "inline-block",
    background: "#f5f5f5",
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

  modal_close_icon: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const PopupDetail = () => {
  const history = useHistory();
  const classes = useStyles();
  const { state } = useLocation();
  const { popup_gubun, popup_pk } = useParams();
  const { control, register, reset, watch, setValue, handleSubmit, errors } = useForm();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);

  async function getPopupDetail() {
    let data;
    switch (popup_gubun) {
      case "Notice":
        data = await apiObject.getNoticePopupDetail({ popup_pk });
        break;
      case "Event":
        data = await apiObject.getEventPopupDetail({ popup_pk, inlink_type: state?.inlink_type });
        break;
    }

    reset({
      ...data,
      start_dt: dayjs.unix(data?.start_dt),
      end_dt: +data?.end_dt ? dayjs.unix(data?.end_dt) : null,
      popup_img: [],
    });
    setValue("popup_img", [{ file: null, path: data?.img_url }]);

    if (popup_gubun === "Event") {
      setValue("inlink_type", state?.inlink_type);
      setValue("selected_target", {
        target_name: state?.inlink_type === "EVENT" ? data.event_title : data.product_name,
        target_pk: state?.inlink_type === "EVENT" ? data.event_pk : data.product_pk,
        thumb_img: data.thumb_img,
      });
    }

    setIsTerminated(!data.use_yn);
  }
  async function modifyPopup(form) {
    if (!form.popup_img) {
      alert("?????? ???????????? ??????????????????");
      return;
    }
    if (form.popup_gubun === "Event" && !form.selected_target) {
      alert("????????? ?????? ????????? ??????????????????");
      return;
    }
    if (!window.confirm("????????? ????????? ????????? ?????????????????????????")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.popup_img, page: "etc" });
    if (!paths.length) return;

    form.img_url = paths?.[0];
    form.start_dt = form.start_dt?.unix();
    form.end_dt = form.end_dt?.unix();

    switch (form.popup_gubun) {
      case "Notice":
        await apiObject.modifyNoticePopup({ popup_pk, ...form });
        break;
      case "Event":
        form.target_pk = form.selected_target?.target_pk;
        await apiObject.modifyEventPopup({ popup_pk, inlink_type: state?.inlink_type, ...form });
        break;
    }

    getPopupDetail();
  }
  async function haltPopup() {
    if (!window.confirm("?????? ????????? ?????? ????????????????????????????")) return;

    let restart_dt = dayjs().unix();
    switch (popup_gubun) {
      case "Notice":
        await apiObject.haltNoticePopup({ popup_pk, restart_dt });
        break;
      case "Event":
        await apiObject.haltEventPopup({ popup_pk, restart_dt });
        break;
    }

    getPopupDetail();
  }
  async function removePopup() {
    if (!window.confirm("?????? ????????? ?????????????????????????")) return;

    switch (popup_gubun) {
      case "Notice":
        await apiObject.removeNoticePopup({ popup_pk });
        break;
      case "Event":
        await apiObject.removeEventPopup({ popup_pk });
        break;
    }
    history.push("/popup");
  }

  useEffect(() => {
    getPopupDetail();
  }, [popup_gubun, popup_pk, state]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          {`${popup_gubun === "Notice" ? "??????" : "?????????"} `}
          ?????? ??????
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>?????? ??????</TableCell>
          <TableCell>
            <Controller
              render={({ value }) => <Typography>{value === "Notice" ? "????????????" : "???????????????"}</Typography>}
              name="popup_gubun"
              control={control}
              defaultValue="Notice"
            />
          </TableCell>
        </TableRow>
        {watch("popup_gubun", "Event") === "Event" && (
          <>
            <TableRow>
              <TableCell>????????? ?????? ?????? ??????</TableCell>
              <TableCell>
                <Typography>{state?.inlink_type === "EVENT" ? "?????????" : "??????"}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>????????? ?????? ??????</TableCell>
              <TableCell>
                <Controller
                  render={({ value }) => (
                    <Box display="flex" alignItems="center">
                      {state?.inlink_type === "PRODUCT" && value && (
                        <ImageBox
                          width="100px"
                          height="100px"
                          mr={1}
                          display="inline-block"
                          src={getFullImgURL(value?.thumb_img)}
                        />
                      )}
                      <Typography display="inline">{value?.target_name || "?????? ????????? ??????????????????"}</Typography>
                    </Box>
                  )}
                  name="selected_target"
                  control={control}
                  defaultValue={null}
                  rules={{ required: watch("popup_gubun", "Event") === "Event" }}
                />

                <Button mt={2} size="large" onClick={() => setIsEventModalOpen(true)} disabled={isTerminated}>
                  ???????????? ??????
                </Button>
              </TableCell>
            </TableRow>
          </>
        )}
        <TableRow>
          <TableCell>?????? ??????</TableCell>
          <TableCell>
            <Controller
              render={(props) => (
                <RadioGroup row {...props}>
                  <FormControlLabel
                    value="Layer"
                    control={<Radio color="primary" />}
                    label="????????? ?????????"
                    disabled={isTerminated}
                  />
                  <FormControlLabel
                    value="FullScreen"
                    control={<Radio color="primary" />}
                    label="?????? ?????????"
                    disabled={isTerminated}
                  />
                </RadioGroup>
              )}
              name="popup_type"
              control={control}
              defaultValue="Layer"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>??????</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="title"
              placeholder="?????? ??????"
              inputRef={register({ required: true })}
              error={!!errors.title}
              disabled={isTerminated}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isTerminated ? "??????????????????" : "????????????"}</TableCell>
          <TableCell>
            <Controller
              render={({ ref, ...props }) => (
                <DateTimePicker
                  {...props}
                  inputRef={ref}
                  className={classes.datetimepicker}
                  format={`YYYY.MM.DD  HH:mm`}
                  minutesStep={10}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EventNote />
                      </InputAdornment>
                    ),
                  }}
                  size="small"
                  error={!!errors.start_dt}
                  disabled={isTerminated}
                  maxDate={watch("end_dt") || dayjs.unix(9999999999)}
                  disablePast
                />
              )}
              control={control}
              name={"start_dt"}
              defaultValue={null}
              rules={{ required: true }}
            />

            {!isTerminated && (
              <>
                <Box mx={3} display="inline-flex" alignItems="center" height="40px">
                  ~
                </Box>
                <Controller
                  render={({ ref, ...props }) => (
                    <DateTimePicker
                      {...props}
                      inputRef={ref}
                      className={classes.datetimepicker}
                      format={`YYYY.MM.DD  HH:mm`}
                      minutesStep={10}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <EventNote />
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                      error={!!errors.end_dt}
                      disabled={isTerminated}
                      minDate={watch("start_dt") || dayjs.unix(0)}
                    />
                  )}
                  control={control}
                  name={"end_dt"}
                  defaultValue={null}
                />
              </>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>?????????</TableCell>
          <TableCell>
            <Dropzone
              control={control}
              name="popup_img"
              width="250px"
              ratio={0.625}
              readOnly={isTerminated}
              zoomable
              croppable={{ minWidth: 300 }}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      {state?.inlink_type === "EVENT" ? (
        <EventModal
          open={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSelect={(target) => setValue("selected_target", target)}
          selected_item={watch("selected_target", null)}
        />
      ) : (
        <ProductModal
          open={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSelect={(target) => setValue("selected_target", target)}
          selected_item={watch("selected_target", null)}
        />
      )}

      <Box mt={4} textAlign="center">
        <Button mr={2} onClick={() => history.push("/popup")}>
          ??????
        </Button>
        {!isTerminated && (
          <>
            <Button mr={2} color="primary" onClick={handleSubmit(modifyPopup)}>
              ??????
            </Button>
            {dayjs() > watch("start_dt") && (
              <Button mr={2} style={{ background: "#333", color: "#fff" }} onClick={handleSubmit(haltPopup)}>
                ??????
              </Button>
            )}
          </>
        )}
        <Button color="secondary" onClick={removePopup}>
          ??????
        </Button>
      </Box>
    </Box>
  );
};

const EventModal = ({ open, onClose, onSelect, selected_item }) => {
  const classes = useStyles();

  const [selectedItem, setSelectedItem] = useState();
  const [eventList, setEventList] = useState();
  const [listContext, setListContext] = useState();

  const event_columns = [
    { title: "??????", field: "event_pk", width: 80 },
    { title: "??????", field: "event_gubun_text", width: 160 },
    { title: "??????", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "?????????",
      render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    {
      title: "?????????",
      render: ({ start_dt }) => dayjs.unix(start_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    { title: "????????????", render: ({ termination_yn }) => (termination_yn ? "Y" : "N"), width: 100 },
    {
      title: "????????? ??????",
      render: ({ event_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/event/${event_pk}`)}>
          ??????
        </Button>
      ),
      width: 100,
    },
  ];

  async function getEventList() {
    let data = await apiObject.getEventList({
      ...listContext,
    });
    setEventList(data);
  }

  function isCurItem(row) {
    return row.event_pk == selectedItem?.target_pk;
  }
  function handleOnSelect(target) {
    let tmp = {
      ...target,
      target_name: target.product_name,
      target_pk: target.product_pk,
    };

    setSelectedItem(tmp);
    onSelect(tmp);
    onClose();
  }
  function handleOnEnter() {
    setListContext({
      page: 1,
      search_word: "",
    });
  }
  function handleContextChange(name, value) {
    let tmp = {
      ...listContext,
      [name]: value,
    };
    if (name != "page") {
      tmp.page = 1;
    }

    setListContext(tmp);
  }

  useEffect(() => {
    if (open) {
      getEventList();
    }
  }, [listContext]);

  useEffect(() => {
    setSelectedItem(selected_item);
  }, [selected_item]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleOnEnter}>
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} maxHeight="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          ????????? ??????
        </Typography>

        <Box my={2}>
          <SearchBox defaultValue="" placeholder="???????????????" onSearch={handleContextChange} />
        </Box>

        <ColumnTable
          columns={event_columns}
          data={eventList}
          onRowClick={handleOnSelect}
          options={{
            rowStyle: (row) => ({
              background: isCurItem(row) && "#bbb",
            }),
          }}
        />

        <Box py={6} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext?.page}
            setPage={handleContextChange}
            count={Math.ceil(eventList?.[0]?.total / 10)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};
const ProductModal = ({ open, onClose, onSelect, selected_item }) => {
  const classes = useStyles();
  const { control, watch, setValue } = useForm();

  const [selectedItem, setSelectedItem] = useState();
  const [categoryList, setCategoryList] = useState();
  const [productList, setProductList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    category_type: "B",
    category_pk: "",
  });

  const product_columns = [
    {
      title: "?????? ?????????",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "??????????????????", render: ({ category_yn }) => (category_yn ? "?????????" : "?????????"), width: 120 },
    { title: "???????????????", field: "category_name" },
    { title: "?????????", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "??????",
      render: ({ each_price, box_price, carton_price }) => (
        <>
          {each_price !== 0 && <p>{`??????(${price(each_price)})`}</p>}
          {box_price !== 0 && <p>{`??????(${price(box_price)})`}</p>}
          {carton_price !== 0 && <p>{`??????(${price(carton_price)})`}</p>}
        </>
      ),
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
    let data = await apiObject.getProductList({ ...listContext });
    setProductList(data);
  }

  function isCurItem(row) {
    return row.product_pk == selectedItem?.target_pk;
  }
  function handleOnSelect(target) {
    let tmp = {
      ...target,
      target_name: target.product_name,
      target_pk: target.product_pk,
    };

    setSelectedItem(tmp);
    onSelect(tmp);
    onClose();
  }
  function handleContextChange(name, value) {
    let tmp = {
      ...listContext,
      [name]: value,
    };
    if (name != "page") {
      tmp.page = 1;
    }

    setListContext(tmp);
  }
  async function handleEnter() {
    let data = await apiObject.getCategoryList({});
    setCategoryList(data);

    setListContext({
      page: 1,
      search_word: "",
      category_type: "B",
      category_pk: "",
    });
  }

  useEffect(() => {
    if (open) {
      getProductList();
    }
  }, [listContext]);
  useEffect(() => {
    setValue("category_pk", "");
    handleContextChange("category_pk", "");
  }, [watch("category_type", "")]);

  useEffect(() => {
    setSelectedItem(selected_item);
  }, [selected_item]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleEnter}>
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="700" display="inline">
            ?????? ??????
          </Typography>
        </Box>

        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Box mr={1} display="inline-block">
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
            </Box>

            {watch("category_type", "") === "B" && (
              <Select
                displayEmpty
                margin="dense"
                value={listContext.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">???????????? ??????</MenuItem>
                {categoryList?.categoryBrandList.map((item, index) => (
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
                value={listContext.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">???????????? ??????</MenuItem>
                {categoryList?.categoryNormalList.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                  </MenuItem>
                ))}
              </Select>
            )}

            <Box ml={1} display="inline-block">
              <Typography>?????? ?????? ???: {productList?.[0]?.total}</Typography>
            </Box>
          </Box>

          <SearchBox placeholder="???????????? ??????????????????" onSearch={handleContextChange} />
        </Box>

        <ColumnTable
          columns={product_columns}
          data={productList}
          onRowClick={handleOnSelect}
          options={{
            rowStyle: (row) => ({
              background: isCurItem(row) && "#bbb",
            }),
          }}
        />

        <Box py={6}>
          <Pagination
            page={listContext?.page}
            setPage={handleContextChange}
            count={Math.ceil(productList?.[0]?.total / 10)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};
