import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

import {
  makeStyles,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
  TableRow,
  TableCell,
  Dialog,
  Checkbox,
} from "@material-ui/core";
import { HighlightOff, Close } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, SearchBox } from "components";

const useStyles = makeStyles((theme) => ({
  modal_close_icon: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const PointRegister = () => {
  const history = useHistory();
  const { control, watch,register, setValue, handleSubmit, errors } = useForm();
  const { fields, remove } = useFieldArray({
    control,
    name: "selected_user",
  });

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  async function registCoupon(form) {
    if ( form.reward_point === 0 || form.reward_point == '0'  ) {
      alert("지급할 포인트를 입력하세요.");
      return;
    }else if (!form.selected_user) {
      alert("지급 대상 회원을 선택해주세요");
      return;
    } else if (!window.confirm("한번 지급하면 취소할수 없습니다.\n입력한 정보로 포인트을 지급하시겠습니까?")) {
      return;
    }

    let target_array = [];
    form.selected_user.forEach((item) => {
      target_array.push(item.member_pk);
    });
    await apiObject.registPoint({
      ...form,
      target_array,
    });
    history.push("/point");
  }

  function handleUpdateTarget(member_array) {
    let tmp = [];

    member_array.forEach((item) => {
      let { id, ...others } = item;
      tmp.push(others);
    });

    setValue("selected_user", tmp);
  }

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          포인트 지급 등록
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>대상자</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Button size="large" onClick={() => setIsMemberModalOpen(true)}>
                대상자 검색
              </Button>
            </Box>
            <Box mt={2}>
              {fields.map((item, index) => (
                <Controller
                  key={item.id}
                  render={({ value }) => (
                    <Box px={2} display="flex" alignItems="center">
                      <Typography display="inline">{value.name}</Typography>
                      <IconButton onClick={() => remove(index)}>
                        <HighlightOff />
                      </IconButton>
                    </Box>
                  )}
                  control={control}
                  name={`selected_user.[${index}]`}
                  defaultValue={item}
                />
              ))}
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>지급포인트</TableCell>
          <TableCell>
            <TextField
              size="small"
              type={'number'}
              name="reward_point"
              placeholder="0"
              defaultValue="0"
              inputRef={register({ required: true })}
              error={!!errors.reward_point}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>등록 사유</TableCell>
          <TableCell>
            <TextField
              size="small"
              name="issue_reason"
              fullWidth
              placeholder="등록사유 입력"
              defaultValue="관리자에 의한 발급"
              inputRef={register({ required: true })}
              error={!!errors.issue_reason}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        <Button color="primary" onClick={handleSubmit(registCoupon)}>
          등록
        </Button>
      </Box>

      <MemberModal
        open={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSelect={handleUpdateTarget}
        selectedDefault={fields}
      />
    </Box>
  );
};

const MemberModal = ({ open, onClose, onSelect, selectedDefault }) => {
  const classes = useStyles();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberList, setMemberList] = useState();
  const [lastPage, setLastPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
  });

  const member_columns = [
    {
      title: "",
      render: (row) => (
        <Checkbox
          checked={selectedMembers.some((item) => item.member_pk === row.member_pk)}
          onClick={() => handleSelectRow(row)}
        />
      ),
      width: 80,
    },
    { title: "이름", field: "name" },
    { title: "코드값", field: "special_code", width: 100 },
    {
      title: "회원 정보",
      render: ({ member_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/member/${member_pk}`)}>
          정보
        </Button>
      ),
      width: 100,
    },
  ];

  async function getMemberList() {
    console.log('noh 2', listContext)
    let resultData = await apiObject.getPopMemberList({
      ...listContext,
      is_approval: true,
    });
    console.log('noh 1', resultData.data)
    if ( resultData.data.code == '0000' ) {
      setMemberList(resultData.data.data.userList);
      setLastPage(resultData.data.lastPage)
      setCurrentPage(resultData.data.currentPage)
    }
    
  }

  function handleSelectRow(row) {
    let tmp = [];
    if (selectedMembers.some((item) => item.member_pk === row.member_pk)) {
      tmp = selectedMembers.filter((item) => item.member_pk !== row.member_pk);
    } else {
      tmp = [...selectedMembers, row];
    }

    setSelectedMembers(tmp);
  }
  function handleOnClear() {
    setListContext({
      page: 1,
      search_word: "",
    });
  }
  function handleOnSelect() {
    onSelect(selectedMembers);
    onClose();
  }
  function handleOnEnter() {
    getMemberList();
    setListContext({
      page: 1,
      search_word: "",
    });
  }
  function handleClose() {
    onClose();
    setSelectedMembers(selectedDefault || []);
  }
  function handleContextChange(val) {
    console.log('noh handleContextChange', val)
    setListContext(
      {
        ...listContext,
        search_word :  val.search_word.trim()
      }
    )
  }
  function handleContextChange2(val) {
    if ( val.page <= lastPage ) {
      setListContext(
        {
          ...listContext,
          page :  val.page
        }
      )
    }
    
    //getMemberList();
    //setListContext(tmp);
  }

  useEffect(() => {
    getMemberList();
    console.log('useEffect', listContext)
  }, [listContext.page, listContext.search_word]);

  useEffect(() => {
    setSelectedMembers(selectedDefault || []);
  }, [selectedDefault]);

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleClose}
      onBackdropClick={handleClose}
      onEnter={handleOnEnter}
    >
      <IconButton className={classes.modal_close_icon} onClick={handleClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          쿠폰 대상자 검색
        </Typography>

        <Box my={2} display="flex" justifyContent="space-between" alignItems="flex-end">
          <Box flex="5">
            <SearchBox defaultValue="" placeholder="회원검색" onSearch={handleContextChange} />
          </Box>
          <Box flex="1" textAlign="right">
            <Button color="secondary" onClick={handleOnClear}>
              초기화
            </Button>
          </Box>
          <Box flex="1" textAlign="right">
            <Button color="primary" onClick={handleOnSelect}>
              선택
            </Button>
          </Box>
          
        </Box>

        <ColumnTable columns={member_columns} data={memberList} />

        <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange2}
            count={Math.ceil(memberList?.[0]?.total / 10)}
          />
        </Box>
      </Box>
    </Dialog>
  );
};
