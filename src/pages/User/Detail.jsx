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
  rank_content: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& .MuiAvatar-root": {
      marginLeft: theme.spacing(8),
      width: "7rem",
      height: "7rem",
    },
  },
}));

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
    render: ({ reward_point }) => `+${price(reward_point)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const UserDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const { control, reset, handleSubmit } = useForm();

  const [userInfo, setUserInfo] = useState();
  const [rewardList, setRewardList] = useState();
  const [rewardPage, setRewardPage] = useState(1);
  const [isModify, setIsModify] = useState(false);

  async function getUserDetail() {
    let data = await apiObject.getMemberDetail({ member_pk });

    setUserInfo(data);
    console.log(data);

    reset({
      grade_code: data.grade_code,
      member_type: data.member_type,
      lisence_img: [{ file: null, path: data.img_url }],
    });
  }
  async function getUserReward() {
    let data = await apiObject.getMemberRewardList({ member_pk, page: 1 });

    setRewardList(data);
    console.log(data);
  }

  async function handleApprove() {
    await apiObject.approveMember({ member_pk });
  }
  async function handleUpdate(data) {
    // console.log(data);
    // await apiObject.updateMemberDetail({
    //   ...data,
    //   member_pk,
    //   img_url: userInfo.img_url,
    // });

    // console.log(data.lisence_img?.[0]?.file);
    let path = await apiObject.uploadImage({
      file: data.lisence_img?.[0]?.file,
    });

    // getUserDetail();
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

      <Box my={2}>
        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            등급
          </Typography>

          <Box className={classes.rank_content}>
            <Avatar src={`/image/rank_${userInfo?.grade_code.toLowerCase()}.png`} />
            <Box textAlign="right">
              <Typography variant="h6" fontWeight="700">
                {userInfo?.grade_name || "-"}
              </Typography>
              <Typography>적립률 {userInfo?.rate || "-"}% 적용</Typography>
            </Box>
          </Box>
        </Box>

        <Box className={classes.header_box}>
          <Typography variant="h6" fontWeight="500">
            적립금 현황
          </Typography>

          <Typography textAlign="right" variant="h5" fontWeight="700">
            {price(userInfo?.accumulate_amount) || "-"} 원
          </Typography>
        </Box>
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
          <TableCell>{userInfo?.phone}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>이메일</TableCell>
          <TableCell>{userInfo?.email}</TableCell>
        </TableRow>
        {/* <TableRow>
          <TableCell>권한</TableCell>
          <TableCell>
            <Controller
              as={
                <TextField
                  select
                  size="small"
                  variant="outlined"
                  // readOnly={isModify}
                >
                  <MenuItem value={"Normal"}>일반</MenuItem>
                  <MenuItem value={"Sales"}>영업사원</MenuItem>
                  <MenuItem value={"Admin"}>관리자</MenuItem>
                  <MenuItem value={"ETC"}>기타</MenuItem>
                </TextField>
              }
              control={control}
              name="member_type"
              defaultValue=""
            />
          </TableCell>
        </TableRow> */}
        <TableRow>
          <TableCell>등급</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="Bronze" control={<Radio color="primary" />} label="브론즈" />
                  <FormControlLabel value="Silver" control={<Radio color="primary" />} label="실버" />
                  <FormControlLabel value="Gold" control={<Radio color="primary" />} label="골드" />
                  <FormControlLabel value="Platinum" control={<Radio color="primary" />} label="플래티넘" />
                </RadioGroup>
              }
              name="grade_code"
              control={control}
              defaultValue="Bronze"
            />
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
          <TableCell>{userInfo?.rate} %</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>사업자등록증 첨부</TableCell>
          <TableCell>
            <Dropzone
              control={control}
              name="lisence_img"
              width="90px"
              ratio={1}
              // readOnly={isModify}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box
        py={2}
        display="flex"
        // justifyContent="center"
      >
        {userInfo?.approval_dt ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleUpdate)}>
            정보 수정
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleApprove}>
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
