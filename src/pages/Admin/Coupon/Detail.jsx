import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { price, getRandomColor, getFullImgURL } from "common";
import { apiObject } from "api";
import _ from "lodash";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { EventNote, Search, HighlightOff } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

const useStyles = makeStyles((theme) => ({
  category_input: {
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
}));

export const CouponDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { coupon_pk } = useParams();
  const { control, register, reset, handleSubmit, errors } = useForm();

  const [couponDetail, setCouponDetail] = useState();

  async function getCouponDetail() {
    let data = await apiObject.getCouponDetail({ coupon_pk });

    setCouponDetail(data);
    reset({
      ...data,
      end_dt: dayjs.unix(data.end_dt),
      update_reason: "",
    });
  }
  async function modifyCoupon(form) {
    if (!window.confirm("입력한 정보로 쿠폰을 수정하시겠습니까?")) return;

    await apiObject.modifyCoupon({
      coupon_pk,
      ...form,
      price: form.coupon_type,
      end_dt: form.end_dt?.unix(),
      member_pk: couponDetail?.member_pk,
    });

    getCouponDetail();
  }
  async function removeCoupon() {
    if (!window.confirm("해당 쿠폰을 삭제하시겠습니까?")) return;

    await apiObject.removeCoupon({ coupon_pk });
    history.push("/coupon");
  }

  useEffect(() => {
    getCouponDetail();
  }, [coupon_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          쿠폰 상세정보
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>쿠폰 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <Select displayEmpty error={!!errors?.coupon_type}>
                  <MenuItem value="">쿠폰 종류 선택</MenuItem>
                  <MenuItem value={5000}>5000원권</MenuItem>
                  <MenuItem value={10000}>10000원권</MenuItem>
                  <MenuItem value={50000}>50000원권</MenuItem>
                  <MenuItem value={100000}>100000원권</MenuItem>
                </Select>
              }
              name="coupon_type"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>대상자</TableCell>
          <TableCell>
            <Typography>{couponDetail?.member_name}</Typography>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>사용가능일자</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Typography display="inline">{dayjs.unix(couponDetail?.reg_dt).format("YYYY.MM.DD")}</Typography>
              <Box mx={2} display="inline">
                ~
              </Box>
              <Controller
                render={({ ref, ...props }) => (
                  <DatePicker {...props} inputRef={ref} format="YYYY.MM.DD" size="small" />
                )}
                control={control}
                name="end_dt"
                defaultValue={dayjs().add(90, "day")}
              />
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>수정사유</TableCell>
          <TableCell>
            <TextField
              size="small"
              name="update_reason"
              placeholder="수정사유 입력"
              inputRef={register({ required: true })}
              error={!!errors.update_reason}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        <Button color="primary" onClick={handleSubmit(modifyCoupon)}>
          수정
        </Button>
        <Button ml={2} color="secondary" onClick={removeCoupon}>
          삭제
        </Button>
      </Box>
    </Box>
  );
};
