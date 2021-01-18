import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { price, getRandomColor } from "common";
import { apiObject } from "api";

import {
  Grid,
  Box,
  makeStyles,
  TextField,
  Select,
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

const useStyles = makeStyles((theme) => ({
  category_input: {
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
}));

export const CategoryDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { category_pk } = useParams();
  const { control, watch, setValue, reset, handleSubmit } = useForm();

  const [normalCategoryList, setNormalCategoryList] = useState();

  async function getCategoryDetail() {
    let data = await apiObject.getCategoryDetail({ category_pk });
    console.log(data);
    reset({
      ...data,
      category_logo: [{ file: null, path: data?.category_logo }],
    });
  }
  async function getNormalCategoryList() {
    let data = await apiObject.getNormalCategoryList();

    // let d1 = data.d1?.[0];
    // let d2 = data.d2[d1.code]?.[0];
    // let d3 = data.d3[d2.code]?.[0];

    // reset({ d1, d2, d3 });
    // setValue("d1", d1);
    // setValue("d2", d2);
    // setValue("d3", d3);

    setNormalCategoryList(data);
    console.log(data);
  }

  async function handleAddCategory(data) {
    console.log(data);

    let path = await apiObject.uploadImage({
      // img: data.category_logo?.[0]?.file,
      img: data.category_logo?.[0].file,
    });
    console.log(path);
    // console.log(data);
    // let normalcategory_pk = data.d3?.normalcategory_pk;
    // let category_name = data.category_name || data.d3?.name;

    // let resp = await apiObject.registCategory({
    //   category_name,
    //   category_type: data.category_type,
    //   normalcategory_pk,

    //   // category_logo: data.category_logo?.[0]?.file,
    //   category_logo:
    //     data.category_type === "N"
    //       ? `http://placehold.it/60X60/${getRandomColor()}/ffffff?text=${normalcategory_pk}`
    //       : `http://placehold.it/60X60/${getRandomColor()}/ffffff?text=test_image`,
    // });
    // console.log(resp.data);

    // history.push(`product/category`);
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
    getNormalCategoryList();
  }, [category_pk]);

  useEffect(() => {
    if (watch("d1")) {
      setValue("d2", normalCategoryList?.d2[watch("d1")?.code]?.[0]);
    }
  }, [watch("d1")]);
  useEffect(() => {
    if (watch("d2")) {
      setValue("d3", normalCategoryList?.d3[watch("d2")?.code]?.[0]);
    }
  }, [watch("d2")]);

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
                <TextField select variant="outlined" disabled={category_pk !== "add"}>
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
          {watch("category_type") === "N" ? (
            <TableCell>
              <Controller
                as={
                  <Select variant="outlined" className={classes.category_input}>
                    {normalCategoryList?.d1.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="d1"
                control={control}
                defaultValue=""
              />
              <Controller
                as={
                  <Select variant="outlined" className={classes.category_input}>
                    {normalCategoryList?.d2[watch("d1")?.code || "K1"]?.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="d2"
                control={control}
                defaultValue=""
              />
              <Controller
                as={
                  <Select variant="outlined" className={classes.category_input}>
                    {normalCategoryList?.d3[watch("d2")?.code || "K1K1"]?.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="d3"
                control={control}
                defaultValue=""
              />
            </TableCell>
          ) : (
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
          )}
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
