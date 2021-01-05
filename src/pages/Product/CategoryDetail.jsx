import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { price } from "common";

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
  FormControlLabel,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination } from "components";

export const CategoryDetail = () => {
  const { category_no } = useParams();
  const { control, reset, handleSubmit } = useForm();

  function handleAddCategory(data) {
    console.log("add", data);
  }
  function handleUpdateCategory(data) {
    console.log("update", data);
  }

  useEffect(() => {
    if (category_no !== "add") {
      reset({
        category_name: "아릭스",
        category_type: 2,
      });
    }
  }, [category_no]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          상품 카테고리 {category_no === "add" ? "추가" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>카테고리명</TableCell>
          <TableCell>
            <Controller
              as={<TextField variant="outlined" />}
              placeholder="카테고리명"
              name="category_name"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>카테고리구분</TableCell>
          <TableCell>
            <Controller
              as={
                <TextField select variant="outlined">
                  <MenuItem value={1}>일반</MenuItem>
                  <MenuItem value={2}>브랜드</MenuItem>
                </TextField>
              }
              name="category_type"
              control={control}
              defaultValue={1}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>노출순위 {`(관리자 앱에서만 수정가능.)`}</TableCell>
          <TableCell>
            <Typography>12</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>로고 이미지</TableCell>
          <TableCell>
            <Button variant="contained">파일 찾기</Button>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {category_no === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleAddCategory)}>
            추가
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleUpdateCategory)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};
