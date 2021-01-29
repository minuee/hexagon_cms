import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";

import { price } from "common";

import {
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  Avatar,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

const useStyles = makeStyles((theme) => ({
  product_divider: {
    height: "10px",
    padding: 0,
    borderBottom: "solid 1px #e8e8e8",
    background: "rgba(223, 223, 223, 0.2)",
  },

  shipping_status: {
    display: "flex",
    justifyContent: "space-between",

    "& > *": {
      width: theme.spacing(15),
      "& > :first-child": {
        width: "100%",
        height: theme.spacing(20),
      },
      "& > :last-child": {
        border: "solid 1px #003a7b",
        borderRadius: "5px",
        textAlign: "center",
      },

      "& img": {
        objectFit: "contain",
        objectPosition: "center bottom",
      },
    },
  },

  shipping_indicator: {
    position: "absolute",
    left: theme.spacing(7),
    bottom: theme.spacing(2),

    width: `calc(100% - ${theme.spacing(14)}px)`,
    height: "3px",
    background: "#003a7b",
    zIndex: -1,
  },
}));

const delivery_state = [
  {
    no: 1,
    label: "입금대기",
  },
  {
    no: 2,
    label: "입금확인",
  },
  {
    no: 3,
    label: "출고완료",
  },
];
const shipping_state_list = [
  {
    label: "입금대기",
    code: "WAIT",
  },
  {
    label: "입금완료",
    code: "INCOME",
  },
  {
    label: "출고완료",
    code: "TRANSING",
  },
  {
    label: "결제취소",
    code: "CANCEL_A",
  },
  {
    label: "주문취소",
    code: "CANCEL_B",
  },
  {
    label: "교환요청",
    code: "RETURN",
  },
];

export const UserPurchaseDetail = () => {
  const classes = useStyles();
  const { control, handleSubmit } = useForm();

  const [purchaseInfo, setPurchaseInfo] = useState({
    items: [
      {
        no: 1,
        name: "돌수세미",
        tot_price: 2000,
        detail: [
          {
            unit: "박스",
            amount: 1,
            price: 2000,
          },
        ],
      },
      {
        no: 2,
        name: "철수세미",
        tot_price: 6000,
        detail: [
          {
            unit: "카톤",
            amount: 2,
            price: 5000,
          },
          {
            unit: "낱개",
            amount: 4,
            price: 1000,
          },
        ],
      },
      {
        no: 3,
        name: "모래수세미",
        tot_price: 4800,
        detail: [
          {
            unit: "박스",
            amount: 4,
            price: 4000,
          },
          {
            unit: "낱개",
            amount: 8,
            price: 800,
          },
        ],
      },
    ],
    order: {
      order_no: "20200506-D5446",
      order_dt: 9456665332,
      name: "아릭스 수세미 외 1",
      item_price: 16800,
      event_price: 15800,
      discount_amount: 2000,
      shipping_fee: 5000,
      total_price: 19800,
    },
    user: {
      name: "김진수",
      phone_no: "01012345678",
      email: "djkls@msdkjl.com",
    },
    payment: {
      type: "무통장 입금",
      deposit_name: "김진수",
      not_shipped_type: 1,
    },
    shipping: {
      status: 3,
      reciever_name: "김진수",
      reciever_phone: "01012345678",
      reciever_addr_name: "서울 관악구 남사당로 192",
      reciever_addr_code: "06322",
      additional_info: "문 앞에 둬주세요",
    },
  });

  async function updatePurchaseDetail(data) {
    console.log(data);
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        구매내역 상세
      </Typography>

      <Box mt={4} mb={6}>
        <Typography fontWeight="500">주문 상태</Typography>
        <Box px={6} position="relative">
          <Box className={classes.shipping_status}>
            {delivery_state.map((item) => {
              let isPassed = item.no <= purchaseInfo?.shipping.status;
              return (
                <Box key={item.no}>
                  <Avatar variant="square" src={`/image/order_state_${item.no}.png`} />
                  <Box px={2} py={1} mt={2} bgcolor={isPassed ? "#003a7b" : "#fff"} color={isPassed ? "#fff" : "#000"}>
                    {item.label}
                  </Box>
                </Box>
              );
            })}
            <Box>
              <Avatar variant="square" src={`/image/exchange_request.png`} />
              <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                교환요청
              </Box>
            </Box>
            {/* <Box>
              <Box />
              <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                주문취소
              </Box>
            </Box> */}
            {/* <Box>
              <Box />
              <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                결제취소
              </Box>
            </Box> */}
          </Box>
          <Box className={classes.shipping_indicator} />
        </Box>
      </Box>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문 상품</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>주문번호</TableCell>
          <TableCell colSpan={5}>{purchaseInfo?.order.order_no}</TableCell>
        </TableRow>

        {purchaseInfo?.items.map((item) => (
          <Fragment key={item.no}>
            <TableRow>
              <TableCell colSpan={6} className={classes.product_divider} />
            </TableRow>

            <TableRow>
              <TableCell>상품명</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>총 금액</TableCell>
              <TableCell colSpan={3} align="right">
                {price(item.tot_price)}원
              </TableCell>
            </TableRow>

            {item.detail.map((chunk, index) => (
              <TableRow key={index}>
                <TableCell>단위</TableCell>
                <TableCell>{chunk.unit}</TableCell>
                <TableCell>수량</TableCell>
                <TableCell>{chunk.amount}</TableCell>
                <TableCell>금액</TableCell>
                <TableCell align="right">{price(chunk.price)}원</TableCell>
              </TableRow>
            ))}
          </Fragment>
        ))}
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>구매일시</TableCell>
          <TableCell>{dayjs.unix(purchaseInfo?.order.order_dt).format("YYYY.MM.DD hh:mm")}</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>상품가</TableCell>
          <TableCell align="right">{price(purchaseInfo?.order.event_price)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>할인금액</TableCell>
          <TableCell align="right">{price(purchaseInfo?.order.discount_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송비</TableCell>
          <TableCell align="right">{price(purchaseInfo?.order.shipping_fee)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>총 주문금액</TableCell>
          <TableCell align="right"> {price(purchaseInfo?.order.total_price)}원</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문자 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>주문자명</TableCell>
          <TableCell>{purchaseInfo?.user.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>{purchaseInfo?.user.phone_no}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이메일 주소</TableCell>
          <TableCell>{purchaseInfo?.user.email}</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">결제 수단</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>결제수단</TableCell>
          <TableCell>{purchaseInfo?.payment.type}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>입금자명</TableCell>
          <TableCell>{purchaseInfo?.payment.deposit_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>미출고시 조치방법</TableCell>
          <TableCell>
            {/* <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="Product" control={<Radio color="primary" />} label="상품 입고시 배송" />
                  <FormControlLabel value="Cash" control={<Radio color="primary" />} label="결제수단으로 환불" />
                </RadioGroup>
              }
              name="refund_type"
              control={control}
              defaultValue="Product"
            /> */}
            <Typography>결제수단으로 환불</Typography>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">배송 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>받는 분</TableCell>
          <TableCell>{purchaseInfo?.shipping.reciever_name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>{purchaseInfo?.shipping.reciever_phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송지주소</TableCell>
          <TableCell>{`[${purchaseInfo?.shipping.reciever_addr_code}] ${purchaseInfo?.shipping.reciever_addr_name}`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송시 요청사항</TableCell>
          <TableCell>{purchaseInfo?.shipping.additional_info}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송상태</TableCell>
          <TableCell>
            <Typography>{shipping_state_list[5].label}</Typography>
            {/* <Controller
              as={
                <Select margin="dense" variant="outlined" displayEmpty>
                  <MenuItem value="">주문상태를 선택해주세요</MenuItem>
                  {shipping_state_list.map((item, index) => {
                    return (
                      <MenuItem value={item.code} key={index}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              }
              control={control}
              name="shipping_status"
              defaultValue=""
              rules={{ required: true }}
            /> */}
          </TableCell>
        </TableRow>
      </RowTable>

      {/* <Box py={2} display="flex" justifyContent="center">
        <Button px={3} variant="contained" color="primary" onClick={handleSubmit(updatePurchaseDetail)}>
          수정
        </Button>
      </Box> */}
    </Box>
  );
};
