import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable, ExcelExportButton } from "components";

const useStyles = makeStyles((theme) => ({
  header_buttons: {
    display: "inline-flex",
    alignItems: "center",

    "& > *": {
      marginleft: theme.spacing(1),
    },
  },
  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const header_button_list = [
  {
    label: "가입일자순",
    value: "reg",
  },
  {
    label: "이름순",
    value: "uname",
  },
  {
    label: "구매액순",
    value: "order",
  },
  {
    label: "리워드액순",
    value: "reward",
  },
];
const member_list_columns = [
  { title: "이름", field: "name", width: 240 },
  { title: "코드값", field: "special_code", width: 100 },
  {
    title: "구매총액",
    render: ({ total_amount }) => `${price(total_amount) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "리워드잔액",
    render: ({ remain_reward }) => `${price(remain_reward) || 0}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    title: "등급",
    render: ({ approval, grade_name }) => (approval ? grade_name : "-"),
    width: 100,
  },
  {
    title: "비고",
    render: ({ approval, agent_code }) => (approval ? agent_code && `영업사원코드: ${agent_code}` : "회원가입 미승인"),
    width: 160,
  },
];

export const MemberList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { query, getDataFunction, Pagination, SearchBox, FilterBox } = useQuery(location);

  const [memberList, setMemberList] = useState();
  const [selectedMembers, setSelectedMembers] = useState([]);

  async function getMemberList(query) {
    let data = await apiObject.getMemberList({
      ...query,
    });

    setMemberList(data);
  }
  async function approveSignIn() {
    

    let member_array = [];
    selectedMembers.forEach((item) => {
      if (!item.approval) {
        member_array.push({
          member_pk: item.member_pk,
        });
      }
    });
    if ( member_array.length > 0 ) {
      if (!window.confirm("선택한 회원들을 회원가입 승인하시겠습니까?")) return;
      await apiObject.approveMembers({ member_array });
      getMemberList();
    }
  }

  async function removeMembers() {
    let member_array = [];
    selectedMembers.forEach((item) => {
      member_array.push({
        member_pk: item.member_pk,
      });
    });
    if ( member_array.length > 0 ) {
      if (!window.confirm("선택한 회원들을 삭제하시겠습니까?")) return;
      const reuslt = await apiObject.removeMembers({ member_array });
      if ( reuslt?.data.code == '0000') {
        alert("정상적으로 삭제되었습니다.");
        getMemberList();
      }else{
        alert("오류가 발생하여 요청한 작업을 완료할 수 없습니다");
        return false;
      }
    }
  }

  useEffect(() => {
    getDataFunction(getMemberList);
  }, []);

  ////

  async function handleExportExcel() {
    let data = await apiObject.getExcelLink({ list_type: "U", ...query });
  }

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          회원목록
        </Typography>

        <Box className={classes.header_buttons}>
          <FilterBox type="sort" button_list={header_button_list} default_item="reg" />

          <Button color="primary" ml={3} onClick={approveSignIn} disabled={!selectedMembers?.length}>
            회원가입 승인
          </Button>
          <Button color="primary" ml={3} onClick={removeMembers} disabled={!selectedMembers?.length}>
            회원삭제
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={member_list_columns}
          data={memberList}
          onRowClick={(row) => history.push(`/member/${row.member_pk}`)}
          selection
          onSelectionChange={setSelectedMembers}
          options={{
            selectionProps: (props) => ({
              style: {
                display: props.approval ? "block" : "block",//"none"
              },
            }),
          }}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <ExcelExportButton path="member" />

        <Pagination total={memberList?.[0]?.total} />

        <SearchBox />
      </Grid>
    </Box>
  );
};
