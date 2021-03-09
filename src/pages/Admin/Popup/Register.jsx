import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
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
  IconButton,
  Dialog,
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
    if (!paths.length) return;

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
    reset({ popup_gubun: _.upperFirst(popup_gubun) });
  }, [popup_gubun]);

  useEffect(() => {
    setValue("selected_target", null);
  }, [watch("inlink_type", "EVENT")]);

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
              render={({ value }) => <Typography>{value === "Notice" ? "공지팝업" : "이벤트팝업"}</Typography>}
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
                  render={({ value }) => (
                    <Box display="flex" alignItems="center">
                      {watch("inlink_type", "EVENT") === "PRODUCT" && value && (
                        <ImageBox
                          width="100px"
                          height="100px"
                          mr={1}
                          display="inline-block"
                          src={getFullImgURL(value?.thumb_img)}
                        />
                      )}
                      <Typography display="inline">{value?.target_name || "적용 대상을 선택해주세요"}</Typography>
                    </Box>
                  )}
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
        <Button mr={2} onClick={() => history.push("/popup")}>
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
  const classes = useStyles();
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
    {
      title: "이벤트 정보",
      render: ({ event_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/event/${event_pk}`)}>
          정보
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
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

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
  const { control, watch, setValue } = useForm();

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
    {
      title: "상품 정보",
      render: ({ product_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
          정보
        </Button>
      ),
      width: 100,
      disableClick: true,
    },
  ];

  async function getProductList() {
    let data = await apiObject.getProductList({ ...listContext });
    setProductList(data);
  }

  function handleOnSelect(target) {
    onSelect({
      ...target,
      target_name: target.product_name,
      target_pk: target.product_pk,
    });
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

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleEnter}>
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Box mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="700" display="inline">
            상품 선택
          </Typography>
        </Box>

        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Box mr={1} display="inline-block">
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
            </Box>

            {watch("category_type", "") === "B" && (
              <Select
                displayEmpty
                margin="dense"
                value={listContext.category_pk}
                onChange={(e) => handleContextChange("category_pk", e.target.value)}
              >
                <MenuItem value="">카테고리 분류</MenuItem>
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
                <MenuItem value="">카테고리 분류</MenuItem>
                {categoryList?.categoryNormalList.map((item, index) => (
                  <MenuItem value={item.category_pk} key={index}>
                    {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                  </MenuItem>
                ))}
              </Select>
            )}

            <Box ml={1} display="inline-block">
              <Typography>등록 상품 수: {productList?.[0]?.total}</Typography>
            </Box>
          </Box>

          <SearchBox placeholder="검색어를 입력해주세요" onSearch={handleContextChange} />
        </Box>

        <ColumnTable columns={product_columns} data={productList} onRowClick={handleOnSelect} />

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
