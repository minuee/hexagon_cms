import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { price } from "common";
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
    field: "regdatetime",
    title: "적립일자",
    // render: ({ accumulate_dt }) => dayjs.unix(accumulate_dt).format("YYYY.MM.DD"),
  },
  { field: "name", title: "유저명" },
  { field: "reward_gubun", title: "내역" },
  {
    field: "reward_point",
    title: "리워드액",
    render: ({ reward_point }) => (price(reward_point) ? `+${price(reward_point)}원` : "-"),
    cellStyle: { textAlign: "right" },
  },
];

export const UserDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const { control, register, reset, setValue, watch, handleSubmit } = useForm();
  const cur_grade = grade_benefits[watch("grade_code")];

  const [userInfo, setUserInfo] = useState();
  const [rewardList, setRewardList] = useState();
  const [rewardPage, setRewardPage] = useState(1);

  async function getUserDetail() {
    let data = await apiObject.getMemberDetail({ member_pk });

    setUserInfo(data);
    reset({
      ...data,
      grade_code: data.grade_code,
      member_type: data.member_type,
      lisence_img: [],
    });
    setValue("lisence_img", [{ file: null, path: data.img_url }]);
  }
  async function getUserReward() {
    let data = await apiObject.getMemberRewardList({ member_pk, page: 1 });
    setRewardList(data);
  }

  async function approveUser() {
    if (!window.confirm("해당 회원을 회원가입 승인하시겠습니까?")) return;

    await apiObject.approveMembers({
      member_array: [{ member_pk }],
    });
    getUserDetail();
  }
  async function modifyUser(form) {
    if (!form.lisence_img) {
      alert("사업자등록증 이미지를 첨부해주세요");
      return;
    }
    if (!window.confirm("해당 유저의 정보를 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.lisence_img, page: "member" });
    await apiObject.modifyMemberDetail({
      ...form,
      member_pk,
      company_phone: form.phone,
      img_url: paths?.[0],
    });

    // console.log(form.lisence_img?.[0]?.file);
    // let path = await apiObject.uploadImage({
    //   file: form.lisence_img?.[0]?.file,
    // });

    // getUserDetail();
    // console.log(form);
  }

  useEffect(() => {
    getUserDetail();
    getUserReward();
  }, [member_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        유저 정보 및 리워드 상세
      </Typography>

      <Box mt={2}>
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

        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            적립금 현황
          </Typography>

          <Typography textAlign="right" variant="h5" fontWeight="700">
            {price(userInfo?.reward_point) || "-"} 원
          </Typography>
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
          <TableCell>{userInfo?.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>업종</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="company_class"
              placeholder="업종"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>업태</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="company_type"
              placeholder="업태"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>주소</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="company_address"
              placeholder="주소"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록번호</TableCell>
          <TableCell>{userInfo?.user_id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증 첨부</TableCell>
          <TableCell>
            <Dropzone control={control} name="lisence_img" width="90px" readOnly={!userInfo?.approval_dt} />
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
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="company_ceo"
              placeholder="대표자명"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>전화번호</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="phone"
              placeholder="전화번호"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>대표자 이메일</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="email"
              placeholder="대표자 이메일"
              inputRef={register({ required: true })}
              disabled={!userInfo?.approval_dt}
            />
          </TableCell>
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
          <TableCell>{userInfo?.special_code}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>가입일자</TableCell>
          <TableCell>{dayjs.unix(userInfo?.reg_dt).format("YYYY-MM-DD")}</TableCell>
        </TableRow>
        {userInfo?.approval_dt && (
          <TableRow>
            <TableCell>가입승인일자</TableCell>
            <TableCell>{dayjs.unix(userInfo?.approval_dt).format("YYYY-MM-DD")}</TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell>상태</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup row {...props} onChange={(e) => onChange(JSON.parse(e.target.value))}>
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="사용중" />
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="사용중지" />
                </RadioGroup>
              )}
              name="is_retired"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>등급</TableCell>
          <TableCell>{userInfo?.grade_name}</TableCell>
        </TableRow>
      </RowTable>

      <Box py={2} mb={4} display="flex">
        {userInfo?.approval_dt ? (
          <Button color="primary" onClick={handleSubmit(modifyUser)}>
            정보 수정
          </Button>
        ) : (
          <Button color="primary" onClick={approveUser}>
            회원가입 승인
          </Button>
        )}
      </Box>

      <Box my={2}>
        <Typography fontWeight="500">리워드 히스토리</Typography>
      </Box>
      <ColumnTable columns={reward_history_column} data={rewardList} />
      <Box position="relative" py={6}>
        <Pagination page={rewardPage} setPage={setRewardPage} count={Math.ceil(+rewardList?.[0]?.total / 10)} />
      </Box>
    </Box>
  );
};
