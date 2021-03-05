import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { apiObject } from "api";
import { price } from "common";
import dayjs from "dayjs";

import {
  Box,
  makeStyles,
  TextField,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  header_box: {
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",

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
    title: "일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD HH:mm"),
    width: 240,
  },
  {
    title: "내용",
    render: ({ reward_gubun, order_pk, content }) =>
      reward_gubun === "m" && order_pk > 0 ? "주문포인트 사용" : content,
    width: 160,
  },
  {
    title: "리워드액",
    render: ({ reward_point, reward_gubun }) =>
      price(reward_point) ? `${reward_gubun === "m" ? "-" : "+"}${price(reward_point)}원` : "-",
    cellStyle: { textAlign: "right" },
  },
];

export const MemberDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { member_pk } = useParams();
  const { control, register, reset, setValue, watch, handleSubmit } = useForm();
  const cur_grade = grade_benefits[watch("grade_code")];

  const [memberInfo, setMemberInfo] = useState();
  const [rewardList, setRewardList] = useState();
  const [rewardPage, setRewardPage] = useState(1);

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
  async function getMemberReward() {
    let data = await apiObject.getMemberRewardList({ member_pk, page: 1 });
    setRewardList(data);
  }

  async function approveMember() {
    if (!window.confirm("해당 회원을 회원가입 승인하시겠습니까?")) return;

    await apiObject.approveMembers({
      member_array: [{ member_pk }],
    });
    getMemberDetail();
  }
  async function modifyMember(form) {
    if (!form.lisence_img) {
      alert("사업자등록증 이미지를 첨부해주세요");
      return;
    }
    if (!window.confirm("해당 유저의 정보를 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.lisence_img, page: "member" });
    if (!paths.length) return;

    await apiObject.modifyMember({
      ...form,
      member_pk,
      company_phone: form.phone,
      img_url: paths?.[0],
    });
  }

  useEffect(() => {
    getMemberDetail();
    getMemberReward();
  }, [member_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        유저 정보 및 리워드 상세
      </Typography>

      {memberInfo?.approval_dt && (
        <Box mt={2}>
          <Box width="30rem" className={classes.header_box}>
            <Typography variant="h6" fontWeight="500">
              등급
            </Typography>

            <Box className={classes.grade_content}>
              <ImageBox src={`/image/rank_${cur_grade?.grade_code?.toLowerCase()}.png`} width="7rem" height="7rem" />
              <Box textAlign="right">
                <Typography variant="h6" fontWeight="700">
                  {cur_grade?.grade_name || "-"}
                </Typography>
                <Typography>적립률 {cur_grade?.rate * 100 || "-"}% 적용</Typography>
                {cur_grade?.coupon && <Typography>{price(cur_grade?.coupon)}원 쿠폰 1회 제공</Typography>}
                <Typography>
                  {cur_grade?.delivery === 0
                    ? "배송비 무료"
                    : `${price(cur_grade?.free_amount)}이상 주문시 배송비 무료`}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box width="20rem" className={classes.header_box}>
            <Typography variant="h6" fontWeight="500">
              적립금 현황
            </Typography>

            <Typography textAlign="right" variant="h5" fontWeight="700">
              {price(memberInfo?.remain_reward) || "-"} 원
            </Typography>
          </Box>
        </Box>
      )}

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
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="company_class"
              placeholder="업종"
              inputRef={register({ required: true })}
              disabled={!memberInfo?.approval_dt}
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
              disabled={!memberInfo?.approval_dt}
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
              disabled={!memberInfo?.approval_dt}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록번호</TableCell>
          <TableCell>{memberInfo?.user_id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증 첨부</TableCell>
          <TableCell>
            <Dropzone control={control} name="lisence_img" width="90px" readOnly={!memberInfo?.approval_dt} />
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
              disabled={!memberInfo?.approval_dt}
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
              disabled={!memberInfo?.approval_dt}
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
              disabled={!memberInfo?.approval_dt}
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
          <TableCell>
            {memberInfo?.approval_dt ? (
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup row {...props} onChange={(e) => onChange(e.target.value == "true")}>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용중" />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="사용중지" />
                  </RadioGroup>
                )}
                name="use_yn"
                control={control}
                defaultValue={true}
              />
            ) : (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>회원가입 승인 대기</Typography>
                <Button color="primary" onClick={approveMember}>
                  회원가입 승인
                </Button>
              </Box>
            )}
          </TableCell>
        </TableRow>
        {memberInfo?.approval_dt && (
          <>
            <TableRow>
              <TableCell>등급</TableCell>
              <TableCell>{memberInfo?.grade_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>등급유지기간</TableCell>
              <TableCell>
                {memberInfo?.grade_start} ~ {memberInfo?.grade_end}
              </TableCell>
            </TableRow>
          </>
        )}
      </RowTable>

      <Box py={2} mb={4} display="flex">
        {memberInfo?.approval_dt && (
          <Button color="primary" onClick={handleSubmit(modifyMember)}>
            정보 수정
          </Button>
        )}
      </Box>

      <Box my={2}>
        <Typography fontWeight="500">리워드 히스토리</Typography>
      </Box>
      <ColumnTable
        columns={reward_history_column}
        data={rewardList}
        onRowClick={(row) => row?.order_pk != 0 && history.push(`/order/${row.order_pk}`)}
      />
      <Box position="relative" py={6}>
        <Pagination page={rewardPage} setPage={setRewardPage} count={Math.ceil(+rewardList?.[0]?.total / 10)} />
      </Box>
    </Box>
  );
};
