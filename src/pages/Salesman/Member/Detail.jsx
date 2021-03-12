import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { price, getFullImgURL } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";
import qs from "query-string";

import { Box, makeStyles, TableRow, TableCell, Tab, Tabs } from "@material-ui/core";
import { Typography } from "components/materialui";
import { RowTable, ColumnTable, Pagination, ImageBox, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  header_box: {
    display: "inline-flex",
    flexDirection: "column",
    justifyContent: "space-between",

    width: "30rem",
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
  lisence_img: {
    width: "180px",
    height: "360px",
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

const order_history_column = [
  {
    title: "주문일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD HH:mm"),
    width: 240,
  },
  {
    title: "구매액",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "주문상태",
    field: "order_status_name",
    width: 160,
  },
];
const reward_history_column = [
  {
    title: "일자",
    render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD HH:mm"),
    width: 240,
  },
  {
    title: "리워드액",
    render: ({ reward_point, reward_gubun }) =>
      price(reward_point) ? `${reward_gubun === "m" ? "-" : "+"}${price(reward_point)}원` : "-",
    cellStyle: { textAlign: "right" },
  },
  {
    title: "내용",
    render: ({ reward_gubun, order_pk, content }) =>
      reward_gubun === "m" && order_pk > 0 ? "주문포인트 사용" : content,
    width: 160,
  },
];

export const ManageMemberDetail = () => {
  const classes = useStyles();
  const { member_pk } = useParams();
  const { control, reset, setValue, watch } = useForm();
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

      {memberInfo?.approval_dt && (
        <Box mt={2}>
          <Box className={classes.header_box}>
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
          <TableCell>사업자등록증</TableCell>
          <TableCell>
            <Dropzone control={control} name="lisence_img" width="180px" readOnly zoomable />
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
          <TableCell>
            {memberInfo?.approval_dt ? (
              <Typography>{memberInfo?.use_yn ? "사용중" : "사용중지"}</Typography>
            ) : (
              <Typography>회원가입 승인 대기</Typography>
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

      <SubTable mt={4} member_pk={member_pk} />
    </Box>
  );
};

const SubTable = ({ member_pk, ...props }) => {
  const history = useHistory();
  const location = useLocation();
  const query = qs.parse(location.search);

  const [subTableData, setSubTableData] = useState();

  async function getSubTableData() {
    if (!member_pk) return;

    let data;

    switch (query.tab || "order") {
      case "order":
        data = await apiObject.getMemberOrderList({ member_pk, ...query });
        break;
      case "reward":
        data = await apiObject.getMemberRewardList({ member_pk, ...query });
        break;
    }

    setSubTableData(data);
  }

  function handleQueryChange(update) {
    if (!update.hasOwnProperty("page")) {
      update.page = 1;
    }

    Object.assign(query, update);
    history.push(`/member/${member_pk}/?` + qs.stringify(query));
  }

  useEffect(() => {
    getSubTableData();
  }, [member_pk, query.tab, query.page]);

  return (
    <Box {...props}>
      <Tabs value={query?.tab || "order"} onChange={(e, v) => handleQueryChange({ tab: v })}>
        <Tab value="order" label="주문내역" />
        <Tab value="reward" label="리워드 히스토리" />
      </Tabs>

      <Box mt={1}>
        <ColumnTable
          columns={query.tab === "reward" ? reward_history_column : order_history_column}
          data={subTableData}
          onRowClick={(row) => (query.tab || "order") === "order" && history.push(`/order/${row.order_pk}`)}
        />
      </Box>

      <Box position="relative" py={6}>
        <Pagination
          page={query.page}
          setPage={(q, v) => handleQueryChange({ page: v })}
          count={Math.ceil(+subTableData?.[0]?.total / 10)}
        />
      </Box>
    </Box>
  );
};
