import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
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
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination } from "components";

const useStyles = makeStyles((theme) => ({
  shipping_status: {
    display: "flex",
    justifyContent: "space-between",
    paddingRight: theme.spacing(6),
    paddingLeft: theme.spacing(6),

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
}));

export const PurchaseDetail = () => {
  const classes = useStyles();

  const [purchaseInfo, setPurchaseInfo] = useState({
    item: {
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

  const shipping_states = [
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
      label: "상품준비완료",
    },
    {
      no: 4,
      label: "배송시작",
    },
    {
      no: 5,
      label: "배송완료",
    },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        구매내역 상세
      </Typography>

      <Box mt={4} mb={6}>
        <Typography fontWeight="500">주문 상태</Typography>
        <Box className={classes.shipping_status}>
          {shipping_states.map((item) => {
            let isPassed = item.no <= purchaseInfo?.shipping.status;
            return (
              <Box>
                <Avatar variant="square" src={`/image/order_state_${item.no}.png`} />
                <Box px={2} py={1} mt={2} bgcolor={isPassed ? "#003a7b" : "#fff"} color={isPassed ? "#fff" : "#000"}>
                  {item.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문 상품 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>주문번호</TableCell>
          <TableCell>{purchaseInfo?.item.order_no}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>구매일시</TableCell>
          <TableCell>{dayjs(purchaseInfo?.item.order_dt).format("YYYY.MM.DD hh:mm")}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품명</TableCell>
          <TableCell>{purchaseInfo?.item.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품금액</TableCell>
          <TableCell>{price(purchaseInfo?.item.item_price)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이벤트가</TableCell>
          <TableCell>{price(purchaseInfo?.item.event_price)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>할인금액</TableCell>
          <TableCell>{price(purchaseInfo?.item.discount_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송비</TableCell>
          <TableCell>{price(purchaseInfo?.item.shipping_fee)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>총 주문금액</TableCell>
          <TableCell>{price(purchaseInfo?.item.total_price)}원</TableCell>
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
          <TableCell>{purchaseInfo?.payment.not_shipped_type}</TableCell>
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
          <TableCell>{purchaseInfo?.shipping.status}</TableCell>
        </TableRow>
      </RowTable>

      <Box py={2} display="flex" justifyContent="center">
        <Button px={3} variant="contained" color="primary">
          수정
        </Button>
      </Box>
    </Box>
  );
};
