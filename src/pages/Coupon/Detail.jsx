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

const user_list_sample = [
  {
    special_code: "xs2987",
    name: "전지현",
  },
  {
    special_code: "k9801d",
    name: "김범수",
  },
  {
    special_code: "98dl1d",
    name: "김태희",
  },
  {
    special_code: "2lx31d",
    name: "손예진",
  },
  {
    special_code: "0mf2x2",
    name: "김범석",
  },
];

export const CouponDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { coupon_pk } = useParams();
  const { control, register, watch, setValue, reset, handleSubmit, errors } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "target_user",
  });

  const [userFilter, setUserFilter] = useState("");
  const [userList, setUserList] = useState([]);

  async function getCouponDetail() {
    let tmp_users = [
      {
        special_code: "98dl1d",
        name: "김태희",
      },
      {
        special_code: "0mf2x2",
        name: "김범석",
      },
    ];
    setUserList(_.differenceBy(user_list_sample, tmp_users, "special_code"));

    reset({
      coupon_type: 10000,
      target_user: [],
      coupon_start_dt: dayjs.unix(1982091826),
    });
    setValue("target_user", tmp_users);
  }
  async function registCoupon(data) {
    console.log(data);
  }
  async function updateCoupon(data) {
    console.log(data);
  }

  function handleAppendTarget(user) {
    setUserList(_.differenceBy(userList, fields, [user], "special_code"));
    append(user);
  }

  useEffect(() => {
    if (coupon_pk !== "add") {
      getCouponDetail();
    } else {
      setUserList(user_list_sample);
    }
  }, [coupon_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          쿠폰 {coupon_pk === "add" ? "등록" : "정보"}
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
                onKeyDown={(e) => e.key === "Enter" && {}}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => {}}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box mx={1} display="inline-block" />
              <Select value="" variant="outlined" displayEmpty>
                <MenuItem value="">쿠폰대상 선택</MenuItem>
                {userList.map((item, index) => (
                  <MenuItem value={item.special_code} key={index} onClick={() => handleAppendTarget(item)}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box mt={2}>
              {fields.map((item, index) => (
                <Controller
                  key={item.id}
                  render={({ value }) => (
                    <Box px={2} display="flex" alignItems="center">
                      <Typography display="inline">{value.name}</Typography>
                      {/* <Typography display="inline">{value.special_code}</Typography> */}
                      <IconButton onClick={() => remove(index)}>
                        <HighlightOff />
                      </IconButton>
                    </Box>
                  )}
                  control={control}
                  name={`target_user.[${index}]`}
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
              <Controller
                render={({ value, onChange, ref }) => (
                  <DatePicker
                    value={value}
                    onChange={onChange}
                    inputRef={ref}
                    error={!!errors?.coupon_start_dt}
                    format={`YYYY.MM.DD`}
                    placeholder={"사용시작일자 선택"}
                    inputVariant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EventNote />
                        </InputAdornment>
                      ),
                    }}
                    size="small"
                  />
                )}
                name={"coupon_start_dt"}
                control={control}
                defaultValue={null}
                rules={{ required: true }}
              />
              <Box mx={2} display="inline">
                ~
              </Box>
              <Typography display="inline">
                {watch("coupon_start_dt")?.add(90, "day").format("YYYY.MM.DD") || "시작일을 선택해주세요"}
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {coupon_pk === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(registCoupon)}>
            등록
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit(updateCoupon)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};
