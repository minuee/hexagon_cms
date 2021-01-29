import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { price, getFullImgURL } from "common";
import dayjs from "dayjs";
import { apiObject } from "api";

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
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";
import { UserDetail } from "pages/Admin/User/Detail";

const useStyles = makeStyles((theme) => ({
  header_box: {
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",

    width: "25rem",
    height: "13rem",
    background: "#fff",

    border: "solid 1px #ddd",
    borderRadius: "1rem",

    marginRight: theme.spacing(4),
    padding: theme.spacing(3),
  },
  grade_content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& .MuiAvatar-root": {
      // marginLeft: theme.spacing(4),
      width: "7rem",
      height: "7rem",
    },
  },
  lisence_img: {
    width: "180px",
    height: "180px",
  },
}));

const grade_benefits = {
  Bronze: {
    grade_code: "Bronze",
    grade_name: "브론즈",
    delivery: 5500,
    free_amount: 1500000,
    rate: 0.005,
  },
  Silver: {
    grade_code: "Silver",
    grade_name: "실버",
    delivery: 5500,
    free_amount: 1000000,
    rate: 0.01,
    coupon: 50000,
  },
  Gold: {
    grade_code: "Gold",
    grade_name: "골드",
    delivery: 0,
    free_amount: 0,
    rate: 0.015,
    coupon: 100000,
  },
  Platinum: {
    grade_code: "Platinum",
    grade_name: "플래티넘",
    delivery: 0,
    free_amount: 0,
    rate: 0.02,
    coupon: 200000,
  },
};

const purchase_history_column = [
  {
    title: "번호",
    field: "no",
    width: 80,
  },
  {
    title: "구매일자",
    render: ({ purchase_dt }) => dayjs.unix(purchase_dt).format("YYYY.MM.DD"),
  },
  {
    title: "구매액",
    render: ({ purchase_amount }) => `${price(purchase_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  { title: "주문상태", field: "delivery_state", width: 160 },
];
const purchase_history_rows = [
  {
    no: 1,
    purchase_dt: 1890298392,
    purchase_amount: 2000000,
    delivery_state: "배송중",
  },
  {
    no: 2,
    purchase_dt: 1710298392,
    purchase_amount: 100000,
    delivery_state: "주문취소",
  },
  {
    no: 3,
    purchase_dt: 1670298392,
    purchase_amount: 4200000,
    delivery_state: "배송완료",
  },
];

export const MemberDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const { control, register, reset, watch, handleSubmit } = useForm();
  const cur_grade = grade_benefits[watch("grade_code")];

  const [userInfo, setUserInfo] = useState();
  const [rewardList, setPurchaseList] = useState();
  const [rewardPage, setRewardPage] = useState(1);

  async function getUserDetail() {
    let data = await apiObject.getMemberDetail({ member_pk });

    setUserInfo(data);
    reset({
      ...data,
      grade_code: data.grade_code,
      member_type: data.member_type,
      lisence_img: [{ file: null, path: data.img_url }],
    });
  }
  async function getUserPurchaseHistory() {
    // let data = await apiObject.getMemberRewardList({ member_pk, page: 1 });
    // setPurchaseList(data);
    setPurchaseList(purchase_history_rows);
  }

  useEffect(() => {
    getUserDetail();
    getUserPurchaseHistory();
  }, [member_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        회원 상세 정보
      </Typography>

      <Box my={2}>
        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            등급
          </Typography>

          <Box className={classes.grade_content}>
            <Avatar src={`/image/rank_${cur_grade?.grade_code?.toLowerCase()}.png`} />
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="700">
                {cur_grade?.grade_name || "-"}
              </Typography>
              <Typography>적립률 {cur_grade?.rate * 100 || "-"}% 적용</Typography>
              {cur_grade?.coupon && <Typography>{cur_grade?.coupon}원 쿠폰 1회 제공</Typography>}
              <Typography>
                {cur_grade?.delivery === 0 ? "배송비 무료" : `${cur_grade?.free_amount}이상 주문시 배송비 무료`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            적립금 현황
          </Typography>

          <Typography textAlign="right" variant="h5" fontWeight="700">
            {price(userInfo?.accumulate_amount) || "-"} 원
          </Typography>
        </Box> */}
      </Box>

      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>이름</TableCell>
          <TableCell>{userInfo?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>코드번호</TableCell>
          <TableCell>{userInfo?.special_code}</TableCell>
        </TableRow>
        {userInfo?.approval_dt && (
          <TableRow>
            <TableCell>가입승인일자</TableCell>
            <TableCell>{dayjs.unix(userInfo?.approval_dt).format("YYYY-MM-DD")}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>휴대폰번호</TableCell>
          <TableCell>
            <Typography>{userInfo?.phone}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이메일</TableCell>
          <TableCell>
            <Typography>{userInfo?.email}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>등급</TableCell>
          <TableCell>
            <Typography>{userInfo?.grade_name}</Typography>
          </TableCell>
        </TableRow>
        {/* {userInfo?.approval && (
          <TableRow>
            <TableCell>영업사원 코드</TableCell>
            <TableCell>{userInfo?.salesman_code}</TableCell>
          </TableRow>
        )} */}
        <TableRow>
          <TableCell>적립률</TableCell>
          <TableCell>{cur_grade?.rate * 100} %</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증</TableCell>
          <TableCell>
            <Avatar className={classes.lisence_img} src={getFullImgURL(userInfo?.img_url)} variant="square" />
            {/* <Dropzone
              control={control}
              name="lisence_img"
              width="90px"
              ratio={1}
              // readOnly={isModify}
            /> */}
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} mb={2}>
        <Typography fontWeight="500">구매 히스토리</Typography>
      </Box>
      <ColumnTable columns={purchase_history_column} data={rewardList} />
      <Box position="relative" py={6}>
        <Pagination page={rewardPage} count={1} />
        {/* <Pagination page={rewardPage} setPage={setRewardPage} count={Math.ceil(+rewardList?.[0]?.total / 10)} /> */}
      </Box>
    </Box>
  );
};
