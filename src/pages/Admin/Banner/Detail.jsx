import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import { price } from "common";
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
} from "@material-ui/core";
import { EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

const inner_link_sample = {
  NOTICE: [
    {
      no: 1,
      special_code: 1,
      label: "설 연휴 미끄러짐 주의 공지",
    },
    {
      no: 2,
      special_code: 2,
      label: "2021 코로나 한파 주의보",
    },
  ],
  PRODUCT: [
    {
      no: 1,
      special_code: 3,
      label: "겨울맞이 신상품 출시!",
    },
    {
      no: 2,
      special_code: 4,
      label: "올 해에는 집안에서 따뜻한 설을 즐겨보세요",
    },
    {
      no: 3,
      special_code: 5,
      label: "이탈리아 코로나 특별 상품관",
    },
  ],
  CATEGORY: [
    {
      no: 1,
      special_code: 6,
      label: "이탈리아 코로나 특별 상품관",
    },
  ],
  EVENT: [
    {
      no: 1,
      special_code: 7,
      label: "겨울맞이 신상품 출시!",
    },
    {
      no: 2,
      special_code: 8,
      label: "2021년에도 친구들 많이 데려오소",
    },
    {
      no: 3,
      special_code: 9,
      label: "이탈리아 코로나 특별 상품관",
    },
  ],
};

export const BannerDetail = () => {
  const { banner_pk } = useParams();
  const history = useHistory();
  const { control, register, reset, setValue, watch, handleSubmit, errors } = useForm();

  const [innerLinkList, setInnerLinkList] = useState([]);

  async function getBannerDetail() {
    let data = await apiObject.getBannerDetail({ banner_pk });

    reset({
      ...data,
      banner_img: [],
    });
    setValue("banner_img", [{ file: null, path: data.img_url }]);
  }
  async function registBanner(form) {
    if (!form.banner_img) {
      alert("배너이미지를 등록해주세요");
      return;
    }
    if (!window.confirm("입력한 내용으로 배너를 등록하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({
      img_arr: form.banner_img,
      page: "etc",
    });

    await apiObject.registBanner({
      ...form,
      img_url: paths?.[0],
    });
  }
  async function updateBanner(form) {
    if (!form.banner_img) {
      alert("배너이미지를 등록해주세요");
      return;
    }
    if (!window.confirm("입력한 내용으로 배너를 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({
      img_arr: form.banner_img,
      page: "etc",
    });

    await apiObject.updateBanner({
      banner_pk,
      ...form,
      img_url: paths?.[0],
    });
  }
  async function removeBanner() {
    if (!window.confirm("배너를 삭제하시겠습니까?")) return;

    await apiObject.removeBanner({ banner_pk });
    history.push("/banner");
  }

  useEffect(() => {
    if (banner_pk !== "add") {
      getBannerDetail();
    }
  }, [banner_pk]);

  useEffect(() => {
    setInnerLinkList(inner_link_sample[watch("banner_type", "NOTICE")]);
    setValue("inner_link", "");
  }, [watch("banner_type", "NOTICE")]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          배너 {banner_pk === "add" ? "등록" : "상세"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>배너타입</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="NOTICE" control={<Radio color="primary" />} label="공지사항" />
                  <FormControlLabel value="PRODUCT" control={<Radio color="primary" />} label="상품" />
                  <FormControlLabel value="CATEGORY" control={<Radio color="primary" />} label="카테고리" />
                  <FormControlLabel value="EVENT" control={<Radio color="primary" />} label="이벤트" />
                </RadioGroup>
              }
              name="banner_type"
              control={control}
              defaultValue="NOTICE"
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>링크대상선택</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel
                    value="IN"
                    control={<Radio color="primary" />}
                    label={
                      <Controller
                        as={
                          <Select margin="dense" displayEmpty disabled={watch("link_type", "IN") === "OUT"}>
                            <MenuItem value="">링크 대상을 선택해주세요</MenuItem>
                            {innerLinkList.map((item, index) => (
                              <MenuItem value={item.special_code} key={index}>
                                {item.label}
                              </MenuItem>
                            ))}
                          </Select>
                        }
                        control={control}
                        name="inner_link"
                        defaultValue=""
                        rules={{ required: watch("link_type", "IN") === "IN" }}
                      />
                    }
                  />
                  <FormControlLabel
                    value="OUT"
                    control={<Radio color="primary" />}
                    label={
                      <TextField
                        size="small"
                        name="outer_link"
                        placeholder="외부링크"
                        inputRef={register({ required: watch("link_type", "IN") === "OUT" })}
                        error={!!errors?.outer_link}
                        disabled={watch("link_type", "IN") === "IN"}
                      />
                    }
                  />
                </RadioGroup>
              }
              name="link_type"
              control={control}
              defaultValue="IN"
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
              placeholder="제목을 입력해주세요"
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
              placeholder="내용을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.content}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배너이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="banner_img" width="180px" ratio={0.75} />
            <Typography>이미지 규격은 가로X세로(4:3) 배율로 업로드해주세요</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>노출순서</TableCell>
          <TableCell>
            <Controller
              render={({ value }) => (
                <Typography>{value || "자동으로 최상단에 들어갑니다 앱에서 수정부탁드립니다."}</Typography>
              )}
              control={control}
              name="display_seq"
              defaultValue=""
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} display="flex" justifyContent="center" alignItems="flex-start">
        {banner_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registBanner)}>
            등록
          </Button>
        ) : (
          <>
            <Button color="primary" onClick={handleSubmit(updateBanner)}>
              수정
            </Button>
            <Button mx={2} color="secondary" onClick={handleSubmit(removeBanner)}>
              삭제
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
