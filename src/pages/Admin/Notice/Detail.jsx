import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, TextField, InputAdornment, TableRow, TableCell } from "@material-ui/core";
import { EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

export const NoticeDetail = () => {
  const history = useHistory();
  const { notice_pk } = useParams();
  const { control, register, reset, setValue, handleSubmit, errors } = useForm();

  const [pushHistory, setPushHistory] = useState([]);

  async function getNoticeDetail() {
    let ret = await apiObject.getNoticeDetail({ notice_pk });
    setPushHistory(ret?.pushLog);

    let data = ret?.noticeDetail;
    reset({
      ...data,
      start_dt: dayjs.unix(data.start_dt),
      img_url: [],
    });
    setValue("img_url", [{ file: null, path: data.img_url }]);
  }
  async function registerNotice(form) {
    if (!window.confirm("입력한 정보로 공지를 등록하시겠습니까?")) return;

    if (form.img_url) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.img_url, page: "etc" });
      if (!paths.length) return;
      form.img_url = paths?.[0];
    }

    await apiObject.registNotice({
      ...form,
      start_dt: form.start_dt?.unix(),
    });

    history.push("/notice");
  }
  async function modifyNotice(form) {
    if (!window.confirm("입력한 정보로 공지를 수정하시겠습니까?")) return;

    if (form.img_url) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.img_url, page: "etc" });
      if (!paths.length) return;
      form.img_url = paths?.[0];
    }

    await apiObject.modifyNotice({
      notice_pk,
      ...form,
      start_dt: form.start_dt?.unix(),
    });
  }
  async function removeNotice() {
    if (!window.confirm("공지를 삭제하시겠습니까?")) return;

    await apiObject.removeNotice({ notice_pk });
    history.push("/notice");
  }

  useEffect(() => {
    if (notice_pk !== "add") {
      getNoticeDetail();
    }
  }, [notice_pk]);

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
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EventNote />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors?.start_dt}
                  disablePast
                />
              )}
              name={"start_dt"}
              control={control}
              defaultValue={null}
              rules={{ required: true }}
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
              placeholder="공지 제목을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.title}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>내용</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={10}
              name="content"
              placeholder="공지 내용을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.content}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이미지</TableCell>
          <TableCell>
            <Dropzone mb={1} control={control} name="img_url" width="180px" ratio={1} />
            <Typography>1:1비율의 이미지를 업로드하는 것이 권장됩니다</Typography>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} display="flex" justifyContent="center" alignItems="flex-start">
        <Button mr={2} onClick={() => history.push("/notice")}>
          목록
        </Button>

        {notice_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registerNotice)}>
            등록
          </Button>
        ) : (
          <>
            <Button color="primary" onClick={handleSubmit(modifyNotice)}>
              수정
            </Button>
            <Button mx={2} color="secondary" onClick={removeNotice}>
              삭제
            </Button>
          </>
        )}
      </Box>

      <Box mt={-6}>
        <Typography>푸시알림 발송내역</Typography>
        {pushHistory?.map((item, index) => (
          <Box color="#777" mt={1} key={index}>
            {dayjs.unix(item.reg_dt).format(`- YYYY-MM-DD HH:mm`)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
