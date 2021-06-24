import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";
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
  Tabs,
  Tab,
} from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable } from "components";

const member_columns = [
  { field: "name", title: "회원명" },
  { field: "grade_name", title: "등급", width: 240 },
];
const incentive_columns = [
  {
    title: "날짜",
    field: "sales_month",
    width: 120,
  },
  {
    title: "총구매대행액",
    field: "total_amount",
    render: ({ total_amount }) => `${price(total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "인센티브액",
    field: "total_incentive",
    render: ({ total_incentive }) => `${price(total_incentive)}원`,
    cellStyle: { textAlign: "right" },
  },
];

export const SalesmanDetail = () => {
  const { member_pk } = useParams();
  const { control, register, reset, handleSubmit } = useForm();

  const [salesmanInfo, setUserInfo] = useState();

  async function getSalesmanDetail() {
    let data = await apiObject.getSalesmanDetail({ member_pk });
    reset({
      ...data,
    });
    setUserInfo(data);
  }
  async function modifySalesman(form) {
    if (!window.confirm("입력한 정보로 영업사원을 수정하시겠습니까?")) return;
    await apiObject.modifySalesman({ member_pk, ...form });
  }

  useEffect(() => {
    getSalesmanDetail();
  }, [member_pk]);

  return (
    <Box>
      <Box>
        <Typography variant="h5" fontWeight="500">
          영업사원 정보
        </Typography>

        <Box my={2} />

        <RowTable width={"70%"}>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="name"
                placeholder="이름을 입력해주세요"
                inputRef={register({ required: true })}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>아이디</TableCell>
            <TableCell>{salesmanInfo?.user_id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>코드번호</TableCell>
            <TableCell>{salesmanInfo?.special_code}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>등록일자</TableCell>
            <TableCell>{dayjs.unix(salesmanInfo?.reg_dt).format("YYYY-MM-DD")}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>비밀번호</TableCell>
            <TableCell>
              <TextField
                size="small"
                type="password"
                fullWidth
                name="password"
                placeholder="변경 시에만 입력해주세요"
                inputRef={register}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>휴대폰번호</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="phone"
                placeholder="휴대폰 번호를 입력해주세요"
                inputRef={register({ required: true })}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>이메일</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="email"
                placeholder="이메일을 입력해주세요"
                inputRef={register({ required: true })}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>상태</TableCell>
            <TableCell>
              {salesmanInfo?.is_retired ? (
                <Typography>퇴사</Typography>
              ) : (
                <Controller
                  render={({ onChange, ...props }) => (
                    <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                      <FormControlLabel value={false} control={<Radio color="primary" />} label="이용중" />
                      <FormControlLabel value={true} control={<Radio color="primary" />} label="퇴사" />
                    </RadioGroup>
                  )}
                  name="is_retired"
                  control={control}
                  defaultValue={false}
                  disabled={salesmanInfo?.is_retired}
                />
              )}
            </TableCell>
          </TableRow>
        </RowTable>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" fontWeight="500">
          인센티브 비율
        </Typography>

        <Box my={2} />

        <RowTable width={"70%"}>
          <TableRow>
            <TableCell>2천만원이상 (단위: %)</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="incentive_2"
                type="number"
                placeholder="인센티브 비율을 입력해주세요"
                inputRef={register({ required: true })}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3천만원이상 (단위: %)</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="incentive_3"
                type="number"
                placeholder="인센티브 비율을 입력해주세요"
                inputRef={register({ required: true })}
                disabled={salesmanInfo?.is_retired}
              />
            </TableCell>
          </TableRow>
        </RowTable>
      </Box>

      <Box pt={2} mb={4} display="flex">
        {!salesmanInfo?.is_retired && (
          <Button color="primary" onClick={handleSubmit(modifySalesman)}>
            수정
          </Button>
        )}
      </Box>

      <SubTable member_pk={member_pk} salesmanInfo={salesmanInfo} />
    </Box>
  );
};

const SubTable = ({ member_pk, salesmanInfo }) => {
  const history = useHistory();
  const location = useLocation();
  const { query, updateQuery, getDataFunction, Pagination } = useQuery(location);

  const [subTableData, setSubTableData] = useState();

  async function getSubTableData(query) {
    let data = [];

    switch (query?.tab || "member") {
      case "member":
        if (salesmanInfo?.special_code) {
          data = await apiObject.getSalsemanClientList({
            special_code: salesmanInfo?.special_code,
            ...query,
          });
        }
        break;
      case "incentive":
        data = salesmanInfo?.incentive;
        break;
    }
    setSubTableData(data);
  }

  useEffect(() => {
    getDataFunction(getSubTableData);
  }, [salesmanInfo]);

  return (
    <Box>
      <Tabs value={query?.tab || "member"} onChange={(e, v) => updateQuery({ tab: v })}>
        <Tab value="member" label="회원관리" />
        <Tab value="incentive" label="인센티브월별현황" />
      </Tabs>

      <Box my={2}>
        <ColumnTable
          columns={query.tab === "incentive" ? incentive_columns : member_columns}
          data={subTableData}
          onRowClick={(row) =>
            history.push(
              query.tab === "incentive"
                ? `/salesman/incentive/${member_pk}/${row.sales_month}`
                : `/member/${row.member_pk}`,
            )
          }
        />
      </Box>

      <Box position="relative" py={6}>
        {query.tab !== "incentive" && <Pagination total={subTableData?.[0]?.total} />}
      </Box>
    </Box>
  );
};
