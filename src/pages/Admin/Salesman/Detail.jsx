import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

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
  RadioGroup,
  Radio,
  FormControlLabel,
  Tabs,
  Tab,
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

export const SalesmanDetail = () => {
  const classes = useStyles();
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

    console.log("form", form);

    await apiObject.modifySalesman({ member_pk, ...form });

    // getSalesmanDetail();
  }

  useEffect(() => {
    getSalesmanDetail();
  }, [member_pk]);

  return (
    <Box>
      <Typography variant="h5" fontWeight="500">
        영업사원 정보
      </Typography>

      <Box mt={4} />

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

      <Box py={2} display="flex">
        {!salesmanInfo?.is_retired && (
          <Button color="primary" onClick={handleSubmit(modifySalesman)}>
            수정
          </Button>
        )}
      </Box>

      <SalesmanSubTable member_pk={member_pk} special_code={salesmanInfo?.special_code} />
    </Box>
  );
};

const SalesmanSubTable = ({ member_pk, special_code }) => {
  const history = useHistory();

  const [subTableData, setSubTableData] = useState();
  const [tableContext, setTableContext] = useState({
    tab: "member",
    page: 1,
  });

  const member_columns = [
    { field: "name", title: "유저명" },
    { field: "grade_name", title: "등급", width: 240 },
  ];
  const incentive_columns = [
    {
      field: "incentive_dt",
      title: "날짜",
      render: ({ incentive_dt }) => dayjs.unix(incentive_dt).format("YYYY-MM"),
      width: 160,
    },
    {
      field: "total_amount",
      title: "총구매대행액",
      render: ({ total_amount }) => `${price(total_amount)}원`,
      cellStyle: { textAlign: "right" },
    },
    {
      field: "incentive_amount",
      title: "인센티브액",
      render: ({ incentive_amount }) => `${price(incentive_amount)}원`,
      cellStyle: { textAlign: "right" },
    },
  ];

  async function getSubTableData() {
    let data = [];

    switch (tableContext?.tab) {
      case "member":
        if (special_code) {
          data = await apiObject.getSalsemanClientList({ special_code });
        }
        break;
      case "incentive":
        if (member_pk) {
          data = await apiObject.getSalesmanIncentiveList({ member_pk });
        }
        break;
    }

    setSubTableData(data);
  }

  function handleTableContextChange(name, value) {
    let tmp = {
      ...tableContext,
      [name]: value,
    };

    if (name !== "page") {
      tmp.page = 1;
    }

    setTableContext(tmp);
  }

  useEffect(() => {
    getSubTableData();
  }, [tableContext, member_pk, special_code]);

  return (
    <Box>
      <Tabs value={tableContext.tab} onChange={(e, v) => handleTableContextChange("tab", v)}>
        <Tab value="member" label="회원관리" />
        <Tab value="incentive" label="인센티브월별현황" />
      </Tabs>

      <Box my={2}>
        <ColumnTable
          columns={tableContext.tab === "member" ? member_columns : incentive_columns}
          data={subTableData}
          onRowClick={(row) =>
            history.push(
              tableContext.tab === "member" ? `/user/${row.member_pk}` : `/salesman/incentive/${row.month_no}`,
            )
          }
        />
      </Box>

      <Box position="relative" py={6}>
        <Pagination
          page={tableContext.page}
          setPage={handleTableContextChange}
          count={Math.ceil(+subTableData?.[0]?.total / 10)}
        />
      </Box>
    </Box>
  );
};
