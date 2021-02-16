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
    height: "360px",

    "& img": {
      objectFit: "contain",
      objectPosition: "center center",
    },
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

const reward_history_column = [
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

export const ManageMemberDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const { control, reset, setValue, watch, handleSubmit } = useForm();
  const cur_grade = grade_benefits[watch("grade_code")];

  const [memberInfo, setMemberInfo] = useState();

  async function getMemberDetail() {
    let data = await apiObject.getMemberDetail({ member_pk });

    setMemberInfo(data);
    reset({
      ...data,
      grade_code: data.grade_code,
      member_type: data.member_type,
      lisence_img: [],
    });
    setValue("lisence_img", [{ file: null, path: data.img_url }]);
  }

  useEffect(() => {
    getMemberDetail();
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
      </Box>

      <Box mt={4} mb={1}>
        <Typography variant="h5" fontWeight="500">
          사업자 정보
        </Typography>
      </Box>
      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>상호명</TableCell>
          <TableCell>{memberInfo?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>업종</TableCell>
          <TableCell>{memberInfo?.company_class}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>업태</TableCell>
          <TableCell>{memberInfo?.company_type}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>주소</TableCell>
          <TableCell>{memberInfo?.company_address}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록번호</TableCell>
          <TableCell>{memberInfo?.user_id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증 첨부</TableCell>
          <TableCell>
            <Avatar variant="square" className={classes.lisence_img} src={getFullImgURL(memberInfo?.img_url)} />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} mb={1}>
        <Typography variant="h5" fontWeight="500">
          대표자 정보
        </Typography>
      </Box>
      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>대표자명</TableCell>
          <TableCell>{memberInfo?.company_ceo}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>전화번호</TableCell>

          <TableCell>{memberInfo?.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>대표자 이메일</TableCell>
          <TableCell>{memberInfo?.email}</TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} mb={1}>
        <Typography variant="h5" fontWeight="500">
          유저 정보
        </Typography>
      </Box>
      <RowTable width={"70%"}>
        <TableRow>
          <TableCell>관리코드</TableCell>
          <TableCell>{memberInfo?.special_code}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>가입일자</TableCell>
          <TableCell>{dayjs.unix(memberInfo?.reg_dt).format("YYYY-MM-DD")}</TableCell>
        </TableRow>
        {memberInfo?.approval_dt && (
          <TableRow>
            <TableCell>가입승인일자</TableCell>
            <TableCell>{dayjs.unix(memberInfo?.approval_dt).format("YYYY-MM-DD")}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>상태</TableCell>
          <TableCell>{memberInfo?.is_retired ? "사용중" : "사용중지"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>등급</TableCell>
          <TableCell>{memberInfo?.grade_name}</TableCell>
        </TableRow>
      </RowTable>

      <MemberRewardTable member_pk={member_pk} />
    </Box>
  );
};

const MemberRewardTable = ({ member_pk }) => {
  const [rewardList, setRewardList] = useState();
  const [rewardPage, setRewardPage] = useState();

  async function getMemberReward() {
    let data = await apiObject.getMemberRewardList({ member_pk, page: rewardPage });
    setRewardList(data);
  }

  useEffect(() => {
    getMemberReward();
  }, [member_pk, rewardPage]);

  return (
    <>
      <Box my={2}>
        <Typography fontWeight="500">리워드 히스토리</Typography>
      </Box>

      <ColumnTable columns={reward_history_column} data={rewardList} />

      <Box position="relative" py={6}>
        <Pagination page={rewardPage} setPage={setRewardPage} count={Math.ceil(+rewardList?.[0]?.total / 10)} />
      </Box>
    </>
  );
};
