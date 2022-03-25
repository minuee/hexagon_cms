import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, TextField, Select, MenuItem, TableRow, TableCell } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

export const CouponDetail = () => {
  const history = useHistory();
  const { coupon_pk } = useParams();
  const { control, register,watch, reset, setValue,handleSubmit, errors } = useForm();

  const [couponDetail, setCouponDetail] = useState();
  const [isTerminated, setIsTerminated] = useState(false);

  async function getCouponDetail() {
    let data = await apiObject.getCouponDetail({ coupon_pk });
    console.log('dddd',data)
    setIsTerminated(!data.use_yn || data.end_dt < dayjs().unix());
    
    setCouponDetail(data);
    reset({
      ...data,
      end_dt: dayjs.unix(data.end_dt),
    });
    setValue("coupon_type", data.is_direct ? 9 : data.coupon_type);
    setValue("coupon_type_direct", data.is_direct ?  data.coupon_type : 0);
    setValue("update_reason", data.update_reason);
  }
  async function modifyCoupon(form) {
    if ( form.coupon_type === 9 && form.coupon_type_direct < 1  ) {
      alert("직접입력시에는 쿠폰금액을 입력하셔야 합니다.");
      return;
    }else{
      if (!window.confirm("입력한 정보로 쿠폰을 수정하시겠습니까?")) return;

      await apiObject.modifyCoupon({
        coupon_pk,
        ...form,
        price: form.coupon_type == 9 ? form.coupon_type_direct : form.coupon_type,
        is_direct : form.coupon_type == 9 ? true : false,
        end_dt: form.end_dt?.unix(),
        member_pk: couponDetail?.member_pk
      });

      getCouponDetail();
    }
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
          <TableCell>쿠폰분류</TableCell>
          <TableCell>
            {isTerminated ? (
              <Typography>{couponDetail?.coupon_type}원권</Typography>
            ) : (
              <>
              <Controller
                as={
                  <Select displayEmpty error={!!errors?.coupon_type} disabled={isTerminated}>
                    <MenuItem value="">쿠폰 종류 선택</MenuItem>
                    <MenuItem value={5000}>5000원권</MenuItem>
                    <MenuItem value={10000}>10000원권</MenuItem>
                    <MenuItem value={50000}>50000원권</MenuItem>
                    <MenuItem value={100000}>100000원권</MenuItem>
                    <MenuItem value={9}>직접입력</MenuItem>
                  </Select>
                }
                name="coupon_type"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              {watch("coupon_type") === 9 && (
                <Box mt={2}>
                  <TextField
                    size="small"
                    name="coupon_type_direct"
                    placeholder="직졉입력"
                    defaultValue={couponDetail?.is_direct ? couponDetail?.coupon_type : 0}
                    inputRef={register({ required: false })}
                    error={!!errors.coupon_type}
                  />
                </Box>
              )
              }
              </>
            )}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>{!isTerminated ? "사용가능일자" : "발급일자"}</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Typography display="inline">{dayjs.unix(couponDetail?.reg_dt).format("YYYY.MM.DD")}</Typography>

              {!isTerminated && (
                <>
                  <Box mx={2} display="inline">
                    ~
                  </Box>

                  <Controller
                    render={({ ref, ...props }) => (
                      <DatePicker
                        {...props}
                        inputRef={ref}
                        format="YYYY.MM.DD"
                        size="small"
                        disabled={isTerminated}
                        disablePast
                      />
                    )}
                    control={control}
                    name="end_dt"
                    defaultValue={dayjs().add(90, "day")}
                  />
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>발급사유</TableCell>
          <TableCell>{couponDetail?.issue_reason}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>대상자</TableCell>
          <TableCell>
            <Typography>{couponDetail?.member_name}</Typography>
          </TableCell>
        </TableRow>

        {!isTerminated && (
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
        )}
        {isTerminated && (
          <TableRow>
            <TableCell>사용일자</TableCell>
            <TableCell>
              {couponDetail?.order_pk ? (
                <Box display="flex" alignItems="center">
                  <Typography display="inline">
                    {dayjs.unix(couponDetail?.order_rdg_dt).format("YYYY.MM.DD")}
                  </Typography>

                  <Button ml={4} color="primary" onClick={() => history.push(`/order/${couponDetail?.order_pk}`)}>
                    주문확인
                  </Button>
                </Box>
              ) : (
                <Typography>사용기한만료</Typography>
              )}
            </TableCell>
          </TableRow>
        )}
      </RowTable>

      <Box mt={4} textAlign="center">
        <Button onClick={() => history.push("/coupon")}>목록</Button>
        {!isTerminated && (
          <>
            <Button ml={2} color="primary" onClick={handleSubmit(modifyCoupon)}>
              수정
            </Button>
            <Button ml={2} color="secondary" onClick={removeCoupon}>
              삭제
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};
