import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { price } from "common";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  MenuItem,
  InputAdornment,
  Avatar,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

export const NoticeDetail = () => {
  const { notice_no } = useParams();
  const history = useHistory();
  const { control, reset, handleSubmit } = useForm();

  function handleAddNotice(data) {
    console.log("add", data);
  }
  function handleRemoveNotice() {
    console.log("remove", notice_no);
  }
  function handleUpdateNotice(data) {
    console.log("update", data);
  }
  function handleSendNotice() {
    console.log("notice");
  }

  useEffect(() => {
    if (notice_no !== "add") {
      reset({
        notice_title: "설연휴?",
        notice_content: `
dddddd
      ddddd
        줄바꿈테스트
        ㅇㅇㅇ
        `,
        register_dt: dayjs(),
      });
    }
  }, [notice_no]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          공지사항 관리
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>업로드 일시</TableCell>
          <TableCell>
            <Controller
              render={({ ref, ...props }) => (
                <DateTimePicker
                  {...props}
                  inputRef={ref}
                  format={`YYYY.MM.DD  HH:mm`}
                  minutesStep={10}
                  inputVariant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EventNote />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              name={"register_dt"}
              control={control}
              defaultValue={null}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>제목</TableCell>
          <TableCell>
            <Controller
              as={<TextField variant="outlined" fullWidth />}
              placeholder="공지 제목을 입력해주세요"
              name="notice_title"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>내용</TableCell>
          <TableCell>
            <Controller
              as={<TextField variant="outlined" fullWidth multiline rows={10} />}
              placeholder="공지 내용을 입력해주세요"
              name="notice_content"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="notice_img" width="90px" ratio={1} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Push 발송 여부</TableCell>
          <TableCell>
            <Controller
              as={
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label={
                    notice_no !== "add" ? (
                      <p style={{ fontFamily: "Montserrat", fontWeight: "ital,wght@1,300", display: "inline" }}>
                        최근발송: {dayjs.unix(1889883723).format("YYYY-MM-DD hh:mm")}
                      </p>
                    ) : (
                      "체크시 푸시알림이 발송됩니다"
                    )
                  }
                />
              }
              name="push_yn"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} display="flex" justifyContent="center" alignItems="flex-start">
        <Button mr={2} variant="contained" onClick={() => history.push("/notice")}>
          목록
        </Button>

        {notice_no === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleAddNotice)}>
            등록
          </Button>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleRemoveNotice}>
              삭제
            </Button>
            <Button mx={2} variant="contained" color="primary" onClick={handleSubmit(handleUpdateNotice)}>
              수정
            </Button>
            {/* <Box display="inline-block">
              <Button variant="contained" color="secondary" onClick={handleSendNotice}>
                Push 발송
              </Button>
              <p style={{ fontFamily: "Montserrat", fontWeight: "ital,wght@1,300" }}>
                최근발송: {dayjs.unix(1889883723).format("YYYY-MM-DD hh:mm")}
              </p>
            </Box> */}
          </>
        )}
      </Box>
    </Box>
  );
};
