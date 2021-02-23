import React, { useState, useEffect, Fragment } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { apiObject } from "api";
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

const order_status_list = [
  {
    no: 1,
    label: "입금대기",
    code: "WAIT",
  },
  {
    no: 2,
    label: "입금완료",
    code: "INCOME",
  },
  {
    no: 3,
    label: "출고완료",
    code: "TRANSING",
  },
  {
    no: 4,
    label: "주문취소",
    code: "CANCEL_A",
  },
  {
    no: 5,
    label: "주문취소처리",
    code: "CANCEL_B",
  },
  {
    no: 6,
    label: "교환요청",
    code: "RETURN",
  },
];

export const OrderDetail = () => {
  const classes = useStyles();
  const { order_pk } = useParams();
  const { control, reset, setValue, handleSubmit } = useForm();

  const [orderDetail, setOrderDetail] = useState();

  async function getOrderDetail() {
    let data = await apiObject.getOrderDetail({ order_pk });
    console.log(data);

    setOrderDetail(data);
    reset({
      refund_type: data?.orderBase?.refund_type,
      order_status: data?.orderBase?.order_status,
    });
  }

  async function modifyOrderStatus(form) {
    let nowOrderStatus = orderDetail?.orderBase?.order_status;
    let newOrderStatus = form.order_status;

    if (nowOrderStatus === "WAIT") {
      if (newOrderStatus !== "INCOME" && newOrderStatus !== "CANCEL_B") {
        alert("입금처리 또는 주문취소처리로만 변경가능합니다.");
        return;
      }
    } else if (nowOrderStatus === "INCOME" || nowOrderStatus === "RETURN") {
      if (newOrderStatus !== "TRANSING") {
        alert("출고완료처리만 가능합니다.");
        return;
      }
    } else if (nowOrderStatus === "CANCEL_A") {
      if (newOrderStatus !== "CANCEL_B") {
        alert("주문취소처리로만 변경가능합니다.");
        return;
      }
    } else {
      alert("현재 주문상태에서는 상태수정을 할 수 없습니다");
      return;
    }

    if (nowOrderStatus === newOrderStatus) {
      alert("변경할 주문상태를 선택해주세요");
      return;
    }
    if (!window.confirm("선택한 항목으로 주문상태를 변경하시겠습니까?")) return;

    await apiObject.modifyOrderStatus({
      order_pk,
      member_pk: orderDetail.orderBase.member_pk,
      nowOrderStatus,
      newOrderStatus,
    });
  }

  useEffect(() => {
    getOrderDetail();
  }, [order_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        주문내역 상세
      </Typography>

      <Box mt={4} mb={6}>
        <Typography fontWeight="500">주문 상태</Typography>
        <Box px={6} position="relative">
          <Box className={classes.shipping_status}>
            {order_status_list.slice(0, 3).map((item) => {
              let isPassed = item.no <= orderDetail?.orderBase.order_status_no;
              return (
                <Box key={item.no}>
                  <Avatar variant="square" src={`/image/order_state_${item.no}.png`} />
                  <Box px={2} py={1} mt={2} bgcolor={isPassed ? "#003a7b" : "#fff"} color={isPassed ? "#fff" : "#000"}>
                    {item.label}
                  </Box>
                </Box>
              );
            })}
            {orderDetail?.orderBase.order_status_no === 4 && (
              <Box>
                <Avatar variant="square" src={`/image/exchange_request.png`} />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  교환요청
                </Box>
              </Box>
            )}
            {orderDetail?.orderBase.order_status_no === 5 && (
              <Box>
                <Box />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  주문취소
                </Box>
              </Box>
            )}
            {orderDetail?.orderBase.order_status_no === 6 && (
              <Box>
                <Box />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  결제취소
                </Box>
              </Box>
            )}
          </Box>
          <Box className={classes.shipping_indicator} />
        </Box>
      </Box>

      <RowTable headerWidth={15}>
        <TableRow>
          <TableCell>주문상태</TableCell>
          <TableCell>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      {order_status_list.map((item, index) => {
                        return (
                          <MenuItem value={item.code} key={index}>
                            {item.label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  }
                  control={control}
                  name="order_status"
                  defaultValue="WAIT"
                />
              </Box>

              <Button color="primary" onClick={handleSubmit(modifyOrderStatus)}>
                주문상태변경
              </Button>
            </Box>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문 상품</Typography>
      </Box>
      <RowTable headerWidth={15}>
        <TableRow>
          <TableCell>주문번호</TableCell>
          <TableCell colSpan={5}>{orderDetail?.orderBase.order_no}</TableCell>
        </TableRow>

        {orderDetail?.product?.product?.map((item) => (
          <Fragment key={item.product_pk}>
            <TableRow>
              <TableCell colSpan={6} className={classes.product_divider} />
            </TableRow>

            <TableRow>
              <TableCell>상품명</TableCell>
              <TableCell>{item.product_name}</TableCell>
              <TableCell>합계 금액</TableCell>
              <TableCell colSpan={3} align="right">
                {item.discount_price > 0 ? (
                  <Typography>
                    <s>{price(item.total_price)}원</s> &gt; {price(item.discount_price)}원
                  </Typography>
                ) : (
                  `${price(item.total_price)}원`
                )}
              </TableCell>
            </TableRow>

            {item.product_info.child.map((unit, index) => {
              let unit_type_text;
              switch (unit.unit_type) {
                case "Each":
                  unit_type_text = "낱개";
                  break;
                case "Box":
                  unit_type_text = "박스";
                  break;
                case "Carton":
                  unit_type_text = "카톤";
                  break;
              }
              return (
                <TableRow key={index}>
                  <TableCell>단위</TableCell>
                  <TableCell>{unit_type_text}</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell>{unit.quantity}</TableCell>
                  <TableCell>금액</TableCell>
                  <TableCell align="right">
                    {unit.event_price > 0 ? (
                      <Typography display="inline">
                        <s>{price(unit.price)}원</s> &gt; {price(unit.event_price)}원
                      </Typography>
                    ) : (
                      `${price(unit.price)}원`
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </Fragment>
        ))}
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">주문자 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>주문자명</TableCell>
          <TableCell>{orderDetail?.orderBase?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>{orderDetail?.orderBase?.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이메일 주소</TableCell>
          <TableCell>{orderDetail?.orderBase?.email}</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">배송 정보</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>받는 분</TableCell>
          <TableCell>{orderDetail?.orderBase?.delivery_receiver}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>{orderDetail?.orderBase?.delivery_phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송지주소</TableCell>
          <TableCell>{`[${orderDetail?.orderBase?.delivery_address}] ${orderDetail?.orderBase?.delivery_address}`}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송시 요청사항</TableCell>
          <TableCell>{orderDetail?.orderBase?.delivery_memo}</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">결제 금액</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>상품금액</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.product_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품할인금액</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.discount_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송비</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.delivery_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>포인트사용</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.point_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>쿠폰사용</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.coupon_amount)}원</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>최종결제금액</TableCell>
          <TableCell align="right"> {price(orderDetail?.orderBase?.total_amount)}원</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={3} mb={1}>
        <Typography fontWeight="500">결제 수단</Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>결제수단</TableCell>
          <TableCell>{orderDetail?.orderBase?.settle_type_name}</TableCell>
        </TableRow>

        {orderDetail?.orderBase?.settle_type === "vbank" && (
          <>
            <TableRow>
              <TableCell>입금계좌</TableCell>
              <TableCell>{`${orderDetail?.settleInfo?.vbank_name} ${orderDetail?.settleInfo?.vbank_num} ${orderDetail?.settleInfo?.vbank_holder}`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>입금기한</TableCell>
              <TableCell>{dayjs.unix(orderDetail?.settleInfo?.vbank_date).format(`YYYY-MM-DD  HH:mm 까지`)}</TableCell>
            </TableRow>
          </>
        )}
        {orderDetail?.orderBase?.settle_type === "card" && (
          <TableRow>
            <TableCell>주문카드</TableCell>
            <TableCell>{`${orderDetail?.settleInfo?.card_name} ${orderDetail?.settleInfo?.card_number}`}</TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell>미출고시 조치방법</TableCell>
          <TableCell>
            {orderDetail?.orderBase?.refund_type === "Product" ? "상품 입고시 배송" : "결제수단으로 환불"}
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} mb={10}>
        {orderDetail?.orderLog?.orderhistory?.map((item, index) => (
          <Box color="#777" mt={1} key={index}>
            {dayjs.unix(item.reg_dt).format(`${item.comment}  YYYY-MM-DD HH:mm`)}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
