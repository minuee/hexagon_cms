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
  Avatar,
  IconButton,
  TableRow,
  TableCell,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { EventNote, Search, HighlightOff } from "@material-ui/icons";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  category_input: {
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
}));

export const CouponRegister = () => {
  const classes = useStyles();
  const history = useHistory();
  const { coupon_pk } = useParams();
  const { control, register, watch, setValue, reset, handleSubmit, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selected_user",
  });

  const [userFilter, setUserFilter] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);

  async function getUserList() {
    let data = await apiObject.getMemberList({ page: 1, paginate: 1000, search_word: userFilter });

    setUserList(data);
    setFilteredList(_.differenceBy(data, fields, "member_pk"));
  }
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

    let resp = await apiObject.registerCoupon({
      ...form,
      price: form.coupon_type,
      end_dt: form.end_dt.unix(),
      target_array,
    });

    history.push("/coupon");
  }

  function handleAppendTarget(user) {
    setFilteredList(_.differenceBy(filteredList, [user], "member_pk"));
    append(user);
  }
  function handleRemoveTarget(index) {
    setFilteredList(_.differenceBy(userList, fields.slice(0, index), fields.slice(index + 1), "member_pk"));
    remove(index);
  }

  useEffect(() => {
    getUserList();
  }, [coupon_pk]);

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
                <Select variant="outlined" displayEmpty error={!!errors?.coupon_type}>
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
              <TextField
                name="search_word"
                placeholder="대상자 검색"
                variant="outlined"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && getUserList()}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => getUserList()}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box mx={1} display="inline-block" />
              <Select value="" variant="outlined" displayEmpty>
                <MenuItem value="">쿠폰대상 선택</MenuItem>
                {filteredList.map((item, index) => (
                  <MenuItem value={item.member_pk} key={index} onClick={() => handleAppendTarget(item)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              <Box mx={1} display="inline-block" />
              <Typography display="inline">검색된 대상: {filteredList.length}</Typography>
            </Box>
            <Box mt={2}>
              {fields.map((item, index) => (
                <Controller
                  key={item.id}
                  render={({ value }) => (
                    <Box px={2} display="flex" alignItems="center">
                      <Typography display="inline">{value.name}</Typography>
                      <IconButton onClick={() => handleRemoveTarget(index)}>
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
                  <DatePicker {...props} inputRef={ref} format="YYYY.MM.DD" inputVariant="outlined" size="small" />
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
              variant="outlined"
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
        <Button variant="contained" color="primary" onClick={handleSubmit(registCoupon)}>
          등록
        </Button>
      </Box>
    </Box>
  );
};
