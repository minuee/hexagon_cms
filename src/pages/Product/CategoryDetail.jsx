import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { price } from "common";
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
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

export const CategoryDetail = () => {
  const { category_pk } = useParams();
  const { control, reset, handleSubmit } = useForm();

  async function getCategoryDetail() {
    let data = await apiObject.getCategoryDetail({ category_pk });
    reset({
      ...data,
      category_logo: [{ file: null, path: data.category_logo }],
    });
  }

  function handleAddCategory(data) {
    console.log("add", data);
  }
  async function handleUpdateCategory(data) {
    console.log("update", data);
    // await apiObject.updateCategoryDetail({
    //   // ...data,
    //   category_pk,
    //   category_name: data.category_name,
    //   category_type: data.category_type,
    //   category_logo: "",
    // });

    getCategoryDetail();
  }

  useEffect(() => {
    if (category_pk !== "add") {
      getCategoryDetail();
    }
  }, [category_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          상품 카테고리 {category_pk === "add" ? "추가" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>카테고리구분</TableCell>
          <TableCell>
            <Controller
              as={
                <TextField select variant="outlined">
                  <MenuItem value="B">브랜드</MenuItem>
                  <MenuItem value="N">제품군</MenuItem>
                </TextField>
              }
              name="category_type"
              control={control}
              defaultValue="B"
            />
          </TableCell>
        </TableRow>
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

        {/* <TableRow>
          <TableCell>노출순위 {`(관리자 앱에서만 수정가능.)`}</TableCell>
          <TableCell>
            <Typography>12</Typography>
          </TableCell>
        </TableRow> */}
        <TableRow>
          <TableCell>로고 이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="category_logo" width="90px" ratio={1} />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {category_pk === "add" ? (
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
