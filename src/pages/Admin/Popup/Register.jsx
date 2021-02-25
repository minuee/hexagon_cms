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
}));

export const PopupRegister = () => {
  const classes = useStyles();
  const history = useHistory();
  const { popup_gubun } = useParams();
  const { control, register, reset, watch, setValue, handleSubmit, errors } = useForm();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  async function registPopup(form) {
    if (!form.popup_img) {
      alert("팝업 이미지를 선택해주세요");
      return;
    }
    if (form.popup_gubun === "Event" && !form.selected_target) {
      alert("이벤트 적용 대상을 선택해주세요");
      return;
    }
    if (!window.confirm("입력한 정보로 팝업을 등록하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.popup_img, page: "etc" });

    form.img_url = paths?.[0];
    form.start_dt = form.start_dt?.unix();
    if (form.inlink_type === "EVENT") {
      form.target_pk = form.selected_target?.event_pk;
    } else {
      form.target_pk = form.selected_target?.product_pk;
    }

    switch (form.popup_gubun) {
      case "Notice":
        await apiObject.registNoticePopup({ ...form });
        break;
      case "Event":
        await apiObject.registEventPopup({ ...form });
        break;
    }
    history.push("/popup");
  }

  useEffect(() => {
    reset({
      popup_gubun: _.upperFirst(popup_gubun),
    });
  }, [popup_gubun]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          팝업 등록
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>팝업 구분</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="Notice" control={<Radio color="primary" />} label="공지팝업" />
                  <FormControlLabel value="Event" control={<Radio color="primary" />} label="이벤트팝업" />
                </RadioGroup>
              }
              name="popup_gubun"
              control={control}
              defaultValue="Notice"
            />
          </TableCell>
        </TableRow>
        {watch("popup_gubun", "Event") === "Event" && (
          <>
            <TableRow>
              <TableCell>이벤트 적용 대상 구분</TableCell>
              <TableCell>
                <Controller
                  as={
                    <RadioGroup row>
                      <FormControlLabel value="EVENT" control={<Radio color="primary" />} label="이벤트" />
                      <FormControlLabel value="PRODUCT" control={<Radio color="primary" />} label="상품" />
                    </RadioGroup>
                  }
                  name="inlink_type"
                  control={control}
                  defaultValue="EVENT"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>이벤트 적용 대상</TableCell>
              <TableCell>
                <Controller
                  as={({ value }) => <Typography>{value?.target_name || "이벤트 적용 대상을 선택해주세요"}</Typography>}
                  name="selected_target"
                  control={control}
                  defaultValue={null}
                  rules={{ required: watch("popup_gubun", "Event") === "Event" }}
                />

                <Button mt={2} size="large" onClick={() => setIsEventModalOpen(true)}>
                  적용대상 선택
                </Button>
              </TableCell>
            </TableRow>
          </>
        )}
        <TableRow>
          <TableCell>팝업 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="Layer" control={<Radio color="primary" />} label="레이어 팝업창" />
                  <FormControlLabel value="FullScreen" control={<Radio color="primary" />} label="전면 팝업창" />
                </RadioGroup>
              }
              name="popup_type"
              control={control}
              defaultValue="Layer"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>제목</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="title"
              placeholder="제목 입력"
              inputRef={register({ required: true })}
              error={!!errors.title}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>오픈시간설정</TableCell>
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
                />
              )}
              control={control}
              name={"start_dt"}
              defaultValue={null}
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="popup_img" width="250px" ratio={1.8} />
          </TableCell>
        </TableRow>
      </RowTable>

      {watch("inlink_type", "EVENT") === "EVENT" ? (
        <EventModal
          open={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSelect={(target) => setValue("selected_target", target)}
        />
      ) : (
        <ProductModal
          open={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSelect={(target) => setValue("selected_target", target)}
        />
      )}

      <Box mt={4} textAlign="center">
        <Button mr={2} onClick={() => history.push("/notice")}>
          목록
        </Button>

        <Button color="primary" onClick={handleSubmit(registPopup)}>
          등록
        </Button>
      </Box>
    </Box>
  );
};

const EventModal = ({ open, onClose, onSelect }) => {
  const [eventList, setEventList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
  });

  const event_columns = [
    { title: "번호", field: "event_pk", width: 80 },
    { title: "종류", field: "event_gubun_text", width: 160 },
    { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "등록일",
      render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    {
      title: "시작일",
      render: ({ start_dt }) => dayjs.unix(start_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    { title: "종료여부", render: ({ termination_yn }) => (termination_yn ? "Y" : "N"), width: 100 },
  ];

  async function getEventList() {
    let data = await apiObject.getEventList({
      ...listContext,
    });
    setEventList(data);
  }

  function handleOnSelect(target) {
    onSelect({
      ...target,
      target_name: target.title,
    });
    onClose();
  }
  function handleOnEnter() {
    getEventList();
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
    getEventList();
  }, [listContext]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleOnEnter}>
      <Box p={3} maxHeight="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          이벤트 검색
        </Typography>

        <Box my={2}>
          <SearchBox defaultValue="" placeholder="이벤트검색" onSearch={handleContextChange} />
        </Box>

        <ColumnTable columns={event_columns} data={eventList} onRowClick={(row) => handleOnSelect(row)} />

        <Box py={6} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(eventList?.[0]?.total / 10)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};
const ProductModal = ({ open, onClose, onSelect }) => {
  const classes = useStyles();

  const [productList, setProductList] = useState();

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
          낱개 &#40;<s>{price(each_price)}</s> &gt; {price(event_each_price)}&#41;원
        </Typography>
      ),
      width: 320,
    },
  ];

  async function getProductList() {
    let data = await apiObject.getEventProductList({});
    setProductList(data);
  }

  function handleOnSelect(target) {
    onSelect({
      ...target,
      target_name: target.product_name,
    });
    onClose();
  }

  function handleEnter() {
    getProductList();
  }

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleEnter}>
      <Box p={3} height="800px" bgcolor="#fff">
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="700" display="inline">
            상품 선택
          </Typography>
        </Box>

        <ColumnTable columns={product_columns} data={productList} onRowClick={handleOnSelect} />
      </Box>
    </Dialog>
  );
};
