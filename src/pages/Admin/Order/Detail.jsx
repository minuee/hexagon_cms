import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import { Box, makeStyles, Select, MenuItem, TableRow, TableCell } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  product_divider: {
    height: "10px",
    padding: 0,
    borderBottom: "solid 1px #e8e8e8",
    background: "rgba(223, 223, 223, 0.2)",
  },

  order_status: {
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
    },
  },
  order_indicator: {
    position: "absolute",
    left: theme.spacing(7),
    bottom: theme.spacing(2),

    width: `calc(100% - ${theme.spacing(14)}px)`,
    height: "3px",
    background: "#003a7b",
    zIndex: -1,
  },
}));
/* 
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
    label: "배송준비중",
    code: "READY",
  },
  {
    no: 4,
    label: "출고완료",
    code: "TRANSING",
  },
  {
    no: 5,
    label: "배송완료",
    code: "TRANSOK",
  },
  {
    no: 6,
    label: "주문취소",
    code: "CANCEL_A",
  },
  {
    no: 7,
    label: "주문취소완료",
    code: "CANCEL_B",
  },
  {
    no: 8,
    label: "교환요청",
    code: "RETURN",
  },
];
 */
export const OrderDetail = () => {
  const classes = useStyles();
  const { order_pk } = useParams();
  const { control, reset, watch, handleSubmit } = useForm();

  const [orderDetail, setOrderDetail] = useState();

  async function getOrderDetail() {
    let data = await apiObject.getOrderDetail({ order_pk });
    setOrderDetail(data);
    reset({
      refund_type: data?.orderBase?.refund_type,
      order_status: data?.orderBase?.order_status,
    });
  }

  async function modifyOrderStatus(form) {
    if (!window.confirm("선택한 항목으로 주문상태를 변경하시겠습니까?")) return;
    
    await apiObject.modifyOrderStatus({
      order_pk,
      member_pk: orderDetail.orderBase.member_pk,
      nowOrderStatus: orderDetail?.orderBase?.order_status,
      newOrderStatus: form.order_status,
      settle_type : orderDetail?.orderBase?.settle_type,
      is_return_order : orderDetail?.orderBase?.isreturn,
    });

    getOrderDetail();
  }
 
  async function pointReturnAction(form) {
    if (!window.confirm("미출고에 따른 적립금으로 환급진행하시겠습니까?")) return;

    await apiObject.modifyPointRefund({
      order_pk,
      member_pk: orderDetail.orderBase.member_pk,
      refund_point : orderDetail?.orderBase?.total_amount + orderDetail?.orderBase?.coupon_amount + orderDetail?.orderBase?.point_amount
    });

    getOrderDetail();
  }

  useEffect(() => {
    getOrderDetail();
  }, [order_pk]);

  const renderUnitPrice = (item,titem) => {

    if ( item.product_info.isHaveCarton && item.product_info.isHaveCartonPrice > 0 ) {
        if ( titem.unit_type === 'Each') {
            return (
              <span>{price(item.product_info.isHaveCartonPrice)}원</span>
            )

        }else if ( titem.unit_type === 'Box') {
            return (
              <span>{price(item.product_info.isHaveCartonPrice*item.product_info.box_unit)}원</span>
            )
        }else{
            return (
              <span>{price(titem.price)}원</span>
            )
        }
    }else  if ( item.product_info.isHaveBox && item.product_info.isHaveBoxPrice > 0 ) {
        if ( titem.unit_type === 'Each') {
            return (
              <span>{price(item.product_info.isHaveBoxPrice)}원</span>
            )

        }else{
            return (
              <span>{price(titem.price)}원</span>
            )
        }
    }else{
        return (
          <span>{price(titem.price)}원</span>
        )

    }
}

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        주문내역 상세
      </Typography>

      <Box mt={4} mb={6}>
        <Typography fontWeight="500">주문 상태</Typography>
        <Box px={6} position="relative">
          <Box className={classes.order_status}>
            {
              orderDetail?.orderLog?.orderhistory?.map((item, index) => {
                if ( item.history_type == 'ORDER' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_ORDER.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        주문완료
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'WAIT' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_INCOME.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        입금대기
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'INCOME' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_INCOME.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        주문완료
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'CANCEL_A' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_CANCEL.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        주문취소
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'CANCEL_B' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_CANCEL.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        주문취소완료
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'REFUND' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_CANCEL.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        미출고처리
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'READY' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_READY.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        배송준비중
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'TRANSING' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_TRANS.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        배송중
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'TRANSOK' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_TRANS.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        배송완료
                      </Box>
                    </Box>
                  );
                }else if ( item.history_type == 'RETURN' ) {
                  return (
                    <Box key={item.orderhistory_pk}>                    
                      <ImageBox src={`/image/order_RETURN.png`} position="center bottom" />
                      <Box px={2} py={1} mt={2} bgcolor={"#003a7b"} color={"#fff" }>
                        교환요청
                      </Box>
                    </Box>
                  );
                }else{

                }
               
              })
            }
            {/* {order_status_list.slice(0, 5).map((item) => {
              let isPassed = item.no <= orderDetail?.orderBase.order_status_no;
              return (
                <Box key={item.no}>
                  <ImageBox src={`/image/order_state_${item.no}.png`} position="center bottom" />
                  <Box px={2} py={1} mt={2} bgcolor={isPassed ? "#003a7b" : "#fff"} color={isPassed ? "#fff" : "#000"}>
                    {item.label}
                  </Box>
                </Box>
              );
            })} */}
            {/* {orderDetail?.orderBase.order_status_no === 4 && (
              <Box>
                <ImageBox src={`/image/exchange_request.png`} position="center bottom" />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  교환요청
                </Box>
              </Box>
            )}
            {orderDetail?.orderBase.order_status_no === 6 && (
              <Box>
                <Box />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  주문취소
                </Box>
              </Box>
            )}
            {orderDetail?.orderBase.order_status_no === 7 && (
              <Box>
                <Box />
                <Box px={2} py={1} mt={2} bgcolor="#003a7b" color="#fff">
                  결제취소
                </Box>
              </Box>
            )} */}
          </Box>
          <Box className={classes.order_indicator} />
        </Box>
      </Box>

      <RowTable headerWidth={15}>
        <TableRow>
          <TableCell>주문상태</TableCell>
          <TableCell>
            {orderDetail?.orderBase.next_status_list.length !== 1 ? (
              <Box display="flex" justifyContent="space-between">
                <Controller
                  as={
                    <Select margin="dense" displayEmpty>
                      {orderDetail?.orderBase.next_status_list.map((item, index) => {
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
                  defaultValue=""
                />
                <Button
                  color="primary"
                  onClick={handleSubmit(modifyOrderStatus)}
                  disabled={watch("order_status") === orderDetail?.orderBase?.order_status}
                >
                  주문상태변경
                </Button>
              </Box>
            ) : (
              <Typography>{orderDetail?.orderBase.order_status_text}</Typography>
            )}
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

        {orderDetail?.product?.map((item) => (
          <Fragment key={item.product_pk}>
            <TableRow>
              <TableCell colSpan={6} className={classes.product_divider} />
            </TableRow>

            <TableRow>
              <TableCell>상품명</TableCell>
              <TableCell>
                <Typography>{item.product_name}</Typography>
                <Typography variant="subtitle1">{item.event_limit_price > 0 && "한정판매 대상상품"}</Typography>
              </TableCell>
              <TableCell>합계 금액</TableCell>
              <TableCell colSpan={3} align="right">
                {item.discount_price > 0 ? (
                  <Typography>
                    <s style={{ fontSize: "14px", color: "#888" }}>{price(item.total_price)}원</s>
                    &nbsp;{price(item.discount_price)}원
                  </Typography>
                ) : (
                  `${price(item.total_price)}원`
                )}
              </TableCell>
            </TableRow>

            {item.product_info.child.map((unit, index) => {
              let unit_type_text;
              let unit_count = 0;
              switch (unit.unit_type) {
                case "Each":
                  unit_type_text = "낱개";
                  unit_count = 1;
                  break;
                case "Box":
                  unit_type_text = "박스";
                  unit_count = item.product_info.box_unit;
                  break;
                case "Carton":
                  unit_type_text = "카톤";
                  unit_count = item.product_info.carton_unit;
                  break;
              }
              return (
                <TableRow key={index}>
                  <TableCell>단위</TableCell>
                  {
                    unit.unit_type == "Each" ?
                    <TableCell>{unit_type_text}</TableCell>
                    :
                    <TableCell>
                      {unit_type_text}
                      (낱개수량 : {unit_count})
                    </TableCell>
                  }
                  <TableCell>수량</TableCell>
                  <TableCell>{unit.quantity}</TableCell>
                  <TableCell>금액</TableCell>
                  <TableCell align="right">
                    {unit.event_price > 0 ? (
                      <Typography display="inline">
                        <s style={{ fontSize: "14px", color: "#888" }}>{price(unit.price)}원</s>
                        &nbsp;{price(unit.event_price)}원                        
                      </Typography>
                    ) : (
                      /* `${price(unit.price)}원` */
                      renderUnitPrice(item,unit)
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
          <TableCell>{orderDetail?.orderBase?.delivery_address}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송시 요청사항</TableCell>
          <TableCell>{orderDetail?.orderBase?.delivery_memo}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>슈퍼맨배송</TableCell>
          <TableCell>{orderDetail?.orderBase?.is_superman ? '사용' : '미사용'}</TableCell>
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
          <TableCell>적립예정금액</TableCell>
          <TableCell align="right">{price(orderDetail?.orderBase?.order_reward_point)}원</TableCell>
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
              <TableCell>
                  {`${orderDetail?.settleInfo?.vbank_name} ${orderDetail?.settleInfo?.vbank_num} ${orderDetail?.settleInfo?.vbank_holder}`}
                  {"  "}입금자명 : {orderDetail?.orderBase?.vbank_accountname}
                </TableCell>
            </TableRow>
            {orderDetail?.orderBase?.order_status === "WAIT" && (
              <TableRow>
                <TableCell>입금기한</TableCell>
                <TableCell>
                  {dayjs.unix(orderDetail?.settleInfo?.vbank_date).format(`YYYY-MM-DD  HH:mm 까지`)}
                </TableCell>
              </TableRow>
            )}
          </>
        )}
        {orderDetail?.orderBase?.settle_type === "vbank" && (
          <>
            <TableRow>
              <TableCell>환불 계좌</TableCell>
              <TableCell>
                  {`${orderDetail?.orderBase?.refund_bankname} ${orderDetail?.orderBase?.refund_accountname} ${orderDetail?.orderBase?.refund_bankaccount}`}
                </TableCell>
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
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Box>{ orderDetail?.orderBase?.refund_type === "Product" ? "상품 입고시 배송(전체)" :  orderDetail?.orderBase?.refund_type === "ProductPart" ? "출고가능상품 선 배송(부분)" :  "적립금으로 환급"}</Box>
              { 
                (orderDetail?.orderBase?.refund_type === "Cash"  && orderDetail?.orderBase?.reward_point > 0 ) &&
                <Box>
                  ({orderDetail?.orderBase?.content}   &nbsp;{price(orderDetail?.orderBase?.reward_point)}원
                  &nbsp;&nbsp;&nbsp;{dayjs.unix(orderDetail?.orderBase?.refund_point_dt).format(`YYYY-MM-DD HH:mm`)})                 
                  </Box>
              }
              </Box>
              {/* { 
                ( orderDetail?.orderBase?.refund_type === "Cash" 
                  && (
                    orderDetail?.orderBase?.order_status == 'READY'
                    ||
                    orderDetail?.orderBase?.order_status == 'INCOME'
                    ||
                    orderDetail?.orderBase?.order_status == 'RETURN'
                    )
                  ) &&
                <Button
                  color="primary"
                  onClick={handleSubmit(pointReturnAction)}
                  disabled={orderDetail?.orderBase?.is_refund_point}
                >
                  적립금으로 환급처리
                </Button>
              } */}
              {
              ( orderDetail?.orderBase?.refund_type === "Cash" ) &&
                <Button
                  color="primary"
                  onClick={handleSubmit(pointReturnAction)}
                  disabled={orderDetail?.orderBase?.is_refund_point}
                >
                  적립금으로 환급처리
                </Button>
              }
            </Box>
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
