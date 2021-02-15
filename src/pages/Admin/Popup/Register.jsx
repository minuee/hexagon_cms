import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

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
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, Pagination, SearchBox, Dropzone } from "components";

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

    "& .MuiAvatar-root": {
      width: theme.spacing(15),
      height: theme.spacing(10),
      "& img": {
        objectFit: "contain",
      },
    },
  },
}));

export const PopupRegister = () => {
  const history = useHistory();
  const classes = useStyles();
  const { control, register, reset, watch, setValue, handleSubmit, errors } = useForm();

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  async function registPopup(form) {
    if (!form.popup_img) {
      alert("팝업 이미지를 선택해주세요");
      return;
    }
    if (form.popup_gubun === "Event" && !form.selected_event) {
      alert("적용 이벤트를 선택해주세요");
      return;
    }
    if (!window.confirm("입력한 정보로 팝업을 등록하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.popup_img, page: "etc" });

    form.img_url = paths?.[0];
    form.start_dt = form.start_dt?.unix();
    form.event_pk = form.selected_event?.event_pk;

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

        {watch("popup_gubun", "Event") === "Event" && (
          <TableRow>
            <TableCell>적용 이벤트 선택</TableCell>
            <TableCell>
              <Controller
                as={({ value }) => <Typography>{value?.title || "이벤트를 선택해주세요"}</Typography>}
                name="selected_event"
                control={control}
                defaultValue={null}
                rules={{ required: watch("popup_gubun", "Event") === "Event" }}
              />

              <Button mt={2} size="large" onClick={() => setIsEventModalOpen(true)}>
                이벤트 선택
              </Button>
            </TableCell>
          </TableRow>
        )}
      </RowTable>

      <EventModal
        open={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSelect={(target) => setValue("selected_event", target)}
      />

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
    onSelect(target);
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
    setListContext({
      ...listContext,
      [name]: value,
    });
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