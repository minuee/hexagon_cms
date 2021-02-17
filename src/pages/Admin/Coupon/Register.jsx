import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import dayjs from "dayjs";
import { price, getRandomColor, getFullImgURL } from "common";
import { apiObject } from "api";
import _ from "lodash";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
  Dialog,
} from "@material-ui/core";
import { EventNote, Search, HighlightOff } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone, SearchBox } from "components";

export const CouponRegister = () => {
  const history = useHistory();
  const { control, register, watch, setValue, reset, handleSubmit, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selected_user",
  });

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  async function registCoupon(form) {
    if (!form.selected_user) {
      alert("발행 대상 회원을 선택해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 쿠폰을 발행하시겠습니까?")) {
      return;
    }

    let target_array = [];
    form.selected_user.forEach((item) => {
      target_array.push(item.member_pk);
    });

    await apiObject.registCoupon({
      ...form,
      price: form.coupon_type,
      end_dt: form.end_dt.unix(),
      target_array,
    });

    history.push("/coupon");
  }

  function handleAppendTarget(user_array) {
    let tmp = _.differenceBy(user_array, fields, "member_pk");
    append(tmp);
  }

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          쿠폰 등록
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>쿠폰 종류</TableCell>
          <TableCell>
            <Controller
              as={
                <Select displayEmpty error={!!errors?.coupon_type}>
                  <MenuItem value="">쿠폰 종류 선택</MenuItem>
                  <MenuItem value={5000}>5000원권</MenuItem>
                  <MenuItem value={10000}>10000원권</MenuItem>
                  <MenuItem value={50000}>50000원권</MenuItem>
                  <MenuItem value={100000}>100000원권</MenuItem>
                </Select>
              }
              name="coupon_type"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>

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
          <TableCell>사용가능일자</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Typography display="inline">{dayjs().format("YYYY.MM.DD")}</Typography>
              <Box mx={2} display="inline">
                ~
              </Box>
              <Controller
                render={({ ref, ...props }) => (
                  <DatePicker {...props} inputRef={ref} format="YYYY.MM.DD" size="small" />
                )}
                control={control}
                name="end_dt"
                defaultValue={dayjs().add(90, "day")}
              />
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>등록 사유</TableCell>
          <TableCell>
            <TextField
              size="small"
              name="issue_reason"
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

      <MemberModal open={isMemberModalOpen} onClose={() => setIsMemberModalOpen(false)} onSelect={handleAppendTarget} />
    </Box>
  );
};

const MemberModal = ({ open, onClose, onSelect }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberList, setMemberList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
  });

  const member_columns = [
    { title: "이름", field: "name" },
    { title: "코드값", field: "special_code", width: 100 },
    { title: "휴대폰번호", field: "phone", width: 160 },
    {
      title: "구매액",
      render: ({ total_amount }) => `${price(total_amount) || 0}원`,
      cellStyle: { textAlign: "right" },
    },
    {
      title: "리워드액",
      render: ({ reward_point }) => `${price(reward_point) || 0}원`,
      cellStyle: { textAlign: "right" },
    },
    { title: "등급", field: "grade_name", width: 100 },
    {
      title: "비고",
      render: ({ approval, agent_code }) => (approval ? `영업사원코드:  ${agent_code}` : "회원가입 미승인"),
    },
  ];

  async function getMemberList() {
    let data = await apiObject.getMemberList({
      ...listContext,
    });
    setMemberList(data);
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
  function handleContextChange(name, value) {
    let tmp = {
      ...listContext,
      [name]: value,
    };
    if (name != "page") {
      tmp.page = 1;
    }

    setListContext(tmp);
  }

  useEffect(() => {
    getMemberList();
  }, [listContext.page, listContext.search_word]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleOnEnter}>
      <Box p={3} height="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          쿠폰 대상자 검색
        </Typography>

        <Box my={2}>
          <SearchBox defaultValue="" placeholder="회원검색" onSearch={handleContextChange} />
        </Box>

        <ColumnTable columns={member_columns} data={memberList} selection onSelectionChange={setSelectedMembers} />

        <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(memberList?.[0]?.total / 10)}
          />
          <Button color="primary" onClick={handleOnSelect}>
            선택
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
