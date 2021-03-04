import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, TextField, InputAdornment, TableRow, TableCell, Checkbox, FormControlLabel } from "@material-ui/core";
import { EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

export const NoticeDetail = () => {
  const history = useHistory();
  const { notice_pk } = useParams();
  const { control, register, reset, setValue, handleSubmit, errors } = useForm();

  async function getNoticeDetail() {
    let data = await apiObject.getNoticeDetail({ notice_pk });

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
            <Dropzone control={control} name="img_url" width="90px" ratio={1} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Push 발송 여부</TableCell>
          <TableCell>
            <Controller
              render={({ value, onChange }) => (
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label={notice_pk === "add" && "체크시 푸시알림이 발송됩니다"}
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
              name="send_push"
              control={control}
              defaultValue={false}
            />
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
            {/* <Box display="inline-block">
              <Button  color="secondary" onClick={handleSendNotice}>
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
