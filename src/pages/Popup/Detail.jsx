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
import { DatePicker, TimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  datetimepicker_wrapper: {
    display: "inline",
    "& > *": {
      display: "inline-block",
      width: theme.spacing(20),
      background: "#f5f5f5",
    },
    "& > :nth-child(2)": {
      marginLeft: theme.spacing(1),
      width: theme.spacing(15),
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

export const PopupDetail = () => {
  const { popup_type_1, popup_type_2, popup_no } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const { control, register, reset, watch, handleSubmit } = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "event_item",
    control: control,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAddNotice(data) {
    console.log("add", data);
  }
  function handleRemoveNotice() {
    console.log("remove", popup_no);
  }
  function handleUpdateNotice(data) {
    console.log("update", data);
  }

  function handleRemoveItem(item) {
    console.log("item", item);
  }

  useEffect(() => {
    if (popup_no !== "add") {
      reset({
        popup_location: "2",
        popup_start_dt: {
          date: dayjs.unix(1488203944),
          time: dayjs.unix(1098290345),
        },
        popup_end_dt: {
          date: dayjs.unix(1988203944),
          time: dayjs.unix(1098290345),
        },
      });
    }
  }, [popup_no]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          {`${popup_type_1 === "notice" ? "공지" : "상품이벤트"} `}
          팝업
          {` ${popup_no === "add" ? "등록" : "관리"}`}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>팝업 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="1" control={<Radio color="primary" />} label="레이어 팝업창" />
                  <Box display="inline" ml={2}>
                    <FormControlLabel value="2" control={<Radio color="primary" />} label="전면 팝업창" />
                  </Box>
                </RadioGroup>
              }
              name="popup_location"
              control={control}
              defaultValue="1"
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{popup_type_2 === "cur" ? "시작 기간" : "게시 기간"}</TableCell>
          <TableCell>
            <Box className={classes.datetimepicker_wrapper}>
              <Controller
                as={
                  <DatePicker
                    format="YYYY.MM.DD"
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
                }
                name={"popup_start_dt.date"}
                control={control}
                defaultValue={dayjs()}
              />
              <Controller
                as={<TimePicker format="hh:mm" inputVariant="outlined" size="small" />}
                name={"popup_start_dt.time"}
                control={control}
                defaultValue={dayjs()}
              />
            </Box>

            {popup_type_2 === "prev" && (
              <Box ml={2} display="inline-flex" alignItems="center">
                <Typography display="inline">부터</Typography>
                <Box mx={2} className={classes.datetimepicker_wrapper}>
                  <Controller
                    as={
                      <DatePicker
                        format="YYYY.MM.DD"
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
                    }
                    name={"popup_end_dt.date"}
                    control={control}
                    defaultValue={dayjs()}
                  />

                  <Controller
                    as={<TimePicker format="hh:mm" inputVariant="outlined" size="small" />}
                    name={"popup_end_dt.time"}
                    control={control}
                    defaultValue={dayjs()}
                  />
                </Box>
                <Typography display="inline">까지</Typography>
              </Box>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="popup_img" width="250px" ratio={1.8} />
          </TableCell>
        </TableRow>

        {popup_type_1 === "event" && (
          <>
            <TableRow>
              <TableCell>이벤트 적용 상품</TableCell>
              <TableCell>
                <Controller
                  as={
                    <Select variant="outlined" displayEmpty fullWidth>
                      <MenuItem value="">이벤트를 선택해주세요</MenuItem>
                      <MenuItem value="1">친구초대이벤트</MenuItem>
                      <MenuItem value="2">겨울맞이세일</MenuItem>
                      <MenuItem value="3">1000만다운로드 감사이벤트</MenuItem>
                    </Select>
                  }
                  name="event"
                  control={control}
                  defaultValue=""
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>이벤트 배너 등록</TableCell>
              <TableCell>
                <Box>
                  <FormControlLabel
                    control={<Checkbox color="primary" name="banner_yn" inputRef={register} />}
                    label="배너등록"
                  />
                </Box>
                <Controller
                  as={
                    <Select variant="outlined" size="small" displayEmpty disabled={!watch("banner_yn", false)}>
                      <MenuItem value="">순서 선택</MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem>
                      <MenuItem value="3">3</MenuItem>
                      <MenuItem value="4">4</MenuItem>
                      <MenuItem value="5">5</MenuItem>
                    </Select>
                  }
                  name="banner_priority"
                  control={control}
                  defaultValue={""}
                  rules={{
                    required: watch("banner_yn", false),
                  }}
                />
                <Box mt={1}>
                  <TextField
                    disabled={!watch("banner_yn", false)}
                    variant="outlined"
                    size="small"
                    name="banner_text"
                    placeholder="배너 설명 문구 작성"
                    inputRef={register({ required: watch("banner_yn", false) })}
                  />
                </Box>
              </TableCell>
            </TableRow>
          </>
        )}
      </RowTable>

      <EventItemModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={append}
        onRemove={handleRemoveItem}
      />

      <Box mt={4} textAlign="center">
        <Button mr={2} variant="contained" onClick={() => history.push("/notice")}>
          목록
        </Button>

        {popup_no === "add" ? (
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
          </>
        )}
      </Box>
    </Box>
  );
};

const EventItemModal = ({ open, onClose }) => {
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
