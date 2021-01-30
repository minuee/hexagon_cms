import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { price } from "common";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Avatar,
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
import { RowTable, Dropzone } from "components";

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

    "& .MuiAvatar-root": {
      width: theme.spacing(15),
      height: theme.spacing(10),
      "& img": {
        objectFit: "contain",
      },
    },
  },
}));

const smaple_item_list = [
  {
    no: 1,
    name: "돌수세미",
    price: 111222,
  },
  {
    no: 2,
    name: "철수세미",
    price: 121222,
  },
  {
    no: 3,
    name: "스펀지수세미",
    price: 133332,
  },
  {
    no: 4,
    name: "종이수세미",
    price: 14455452,
  },
];

export const EventDetail = () => {
  const { event_pk } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { control, register, reset, watch, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "event_item",
    control: control,
  });

  const [eventDetail, setEventDetail] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAddNotice(data) {
    console.log("add", data);
  }
  function handleRemoveNotice() {
    console.log("remove", event_pk);
  }
  function handleUpdateNotice(data) {
    console.log("update", data);
  }

  function handleRemoveItem(item) {
    console.log("item", item);
  }

  useEffect(() => {
    if (event_pk !== "add") {
      reset({
        event_type: "LIMIT",
        event_start_dt: dayjs.unix(1488203944),
        event_end_dt: dayjs.unix(1988203944),
      });
      setEventDetail({
        terminate_yn: true,
      });
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
          <TableCell>이벤트 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel
                    value="LIMIT"
                    control={<Radio color="primary" />}
                    label="한정특가"
                    disabled={eventDetail?.terminate_yn}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="TERM"
                    control={<Radio color="primary" />}
                    label="기간할인이벤트"
                    disabled={eventDetail?.terminate_yn}
                  />
                  <Box display="inline" ml={2} />
                  <FormControlLabel
                    value="SALE"
                    control={<Radio color="primary" />}
                    label="할인이벤트"
                    disabled={eventDetail?.terminate_yn}
                  />
                </RadioGroup>
              }
              name="event_type"
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
                    disabled={eventDetail?.terminate_yn}
                  />
                )}
                name={"event_start_dt"}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />

              {watch("event_type", "") === "TERM" && (
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
                        inputVariant="outlined"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <EventNote />
                            </InputAdornment>
                          ),
                        }}
                        size="small"
                        disabled={eventDetail?.terminate_yn}
                      />
                    )}
                    name={"event_end_dt"}
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
              {smaple_item_list.map((item, index) => (
                <Box className={classes.item_wrapper} key={index}>
                  <Avatar variant="square" src="/image/item_sample.png" />
                  <Box ml={2}>
                    <Typography fontWeight="500">{item.name}</Typography>
                    <Typography fontWeight="500">{price(item.price)}원</Typography>
                  </Box>
                  {watch("event_type", "LIMIT") === "LIMIT" && (
                    <TextField
                      inputRef={register({ required: true })}
                      name={`item_amount[${index}]`}
                      placeholder="수량 입력"
                      variant="outlined"
                      size="small"
                      type="number"
                      disabled={eventDetail?.terminate_yn}
                    />
                  )}
                  <IconButton onClick={() => console.log("delete click")} disabled={eventDetail?.terminate_yn}>
                    <HighlightOff />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsModalOpen(true)}
                disabled={eventDetail?.terminate_yn}
              >
                상품 검색
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      </RowTable>

      <ProductModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={append}
        onRemove={handleRemoveItem}
      />

      <Box mt={4} textAlign="center">
        <Button mr={2} variant="contained" onClick={() => history.push("/event")}>
          목록
        </Button>

        {event_pk === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleAddNotice)}>
            등록
          </Button>
        ) : (
          <>
            <Button mr={2} variant="contained" color="primary" onClick={handleRemoveNotice}>
              삭제
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit(handleUpdateNotice)}>
              수정
            </Button>
            {!eventDetail?.terminate_yn && (
              <Button ml={2} variant="contained" color="secondary" onClick={() => console.log("termination")}>
                마감
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

const ProductModal = ({ open, onClose }) => {
  const classes = useStyles();

  const [searchText, setSearchText] = useState("");
  const [categoryTab, setCategoryTab] = useState(0);
  const [itemList, setItemList] = useState([
    {
      item_no: 1,
      name: "철 수세미",
      price: 111111,
    },
    {
      item_no: 2,
      name: "돌 수세미",
      price: 222222,
    },
    {
      item_no: 3,
      name: "모래 수세미",
      price: 3333333,
    },
  ]);

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose} onBackdropClick={onClose}>
      <Box p={2} px={4} width="800px" height="600px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          이벤트 적용 상품
        </Typography>
        <Box mt={2} mb={1}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="상품검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Tabs value={categoryTab} indicatorColor="primary" onChange={(e, v) => setCategoryTab(v)}>
          <Tab label="전체" value={0} />
          <Tab label="아릭스" value={1} />
          <Tab label="드라이팍" value={2} />
          <Tab label="라코로나" value={3} />
          <Tab label="클린로직" value={4} />
        </Tabs>

        <Box px={2}>
          {itemList.map((item, index) => {
            return (
              <FormControlLabel
                className={classes.item_wrapper}
                key={index}
                control={<Checkbox color="primary" />}
                label={
                  <Box display="flex" alignItems="center">
                    <Avatar variant="square" src="/image/item_sample.png" />
                    <Box ml={2}>
                      <Typography fontWeight="500">{item.name}</Typography>
                      <Typography fontWeight="500">{price(item.price)}원</Typography>
                    </Box>
                  </Box>
                }
              />
            );
          })}
        </Box>
      </Box>
    </Dialog>
  );
};
