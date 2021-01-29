import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
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

export const CategoryDetail = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { category_pk } = useParams();
  const { control, watch, setValue, reset, handleSubmit, errors } = useForm();

  const [normalCategoryList, setNormalCategoryList] = useState();

  async function getCategoryDetail() {
    let data = await apiObject.getCategoryDetail({ category_pk, category_type: location.state?.category_type });

    reset({
      ...data,
      category_logo: [],
    });
    setValue("category_logo", [{ file: null, path: data?.category_logo }]);
  }
  async function getNormalCategoryList() {
    let data = await apiObject.getNormalCategoryList();

    setNormalCategoryList(data);
  }

  async function registCategory(data) {
    // console.log(data);

    // let path = "https://hg-prod-file.s3-ap-northeast-1.amazonaws.com/public/default/photo.jpg";
    // if (data.category_logo) {
    //   path = await apiObject.uploadImageSingle({
    //     img: data.category_logo?.[0],
    //     page: "product",
    //   });
    // }
    let path = await apiObject.uploadImageSingle({
      img: data.category_logo?.[0],
      page: "product",
    });

    let normalcategory_pk = data.d3?.normalcategory_pk;
    let category_name = data.category_name || data.d3?.name;

    let resp = await apiObject.registCategory({
      category_name,
      category_type: data.category_type,
      category_logo: path,
      normalcategory_pk,
      // category_logo:
      //   data.category_type === "N"
      //     ? `http://placehold.it/60X60/${getRandomColor()}/ffffff?text=${normalcategory_pk}`
      //     : `http://placehold.it/60X60/${getRandomColor()}/ffffff?text=test_image`,
    });

    history.push(`product/category`);
  }
  async function updateCategory(data) {
    console.log(data);

    let path = await apiObject.uploadImageSingle({
      img: data.category_logo?.[0],
      page: "product",
    });

    if (data.category_type !== "B") {
      for (let c of normalCategoryList.d3[watch("d2")]) {
        if (c.code == data.d3) {
          data.normalcategory_pk = c.normalcategory_pk;
          data.category_name = c.name;
          break;
        }
      }
    }

    let resp = await apiObject.updateCategoryDetail({
      ...data,
      category_pk,
      category_logo: path,
    });

    getCategoryDetail();
  }

  function onCategoryChange(name) {
    if (name === "d1") {
      setValue("d2", "");
      setValue("d3", "");
    } else if (name === "d2") {
      setValue("d3", "");
    }
  }

  useEffect(() => {
    getNormalCategoryList();
    if (category_pk !== "add") {
      getCategoryDetail();
    }
  }, [category_pk, location.state?.category_type]);

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
                <Select
                  className={classes.category_input}
                  variant="outlined"
                  margin="dense"
                  displayEmpty
                  disabled={category_pk !== "add"}
                  error={!!errors?.category_type}
                >
                  <MenuItem value="">카테고리 구분</MenuItem>
                  <MenuItem value="B">브랜드</MenuItem>
                  <MenuItem value="N">제품군</MenuItem>
                </Select>
              }
              name="category_type"
              control={control}
              defaultValue=""
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>카테고리명</TableCell>
          {watch("category_type") === "N" ? (
            <TableCell>
              <Controller
                render={({ onChange, ...props }) => (
                  <Select
                    className={classes.category_input}
                    {...props}
                    onChange={(e) => {
                      onCategoryChange("d1");
                      onChange(e);
                    }}
                    displayEmpty
                    variant="outlined"
                    error={!!errors?.d1}
                  >
                    <MenuItem value="">-</MenuItem>
                    {normalCategoryList?.d1.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name="d1"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              <Controller
                render={({ onChange, ...props }) => (
                  <Select
                    className={classes.category_input}
                    {...props}
                    onChange={(e) => {
                      onCategoryChange("d2");
                      onChange(e);
                    }}
                    variant="outlined"
                    displayEmpty
                    error={!!errors?.d2}
                  >
                    <MenuItem value="">-</MenuItem>
                    {normalCategoryList?.d2[watch("d1")]?.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name="d2"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              <Controller
                as={
                  <Select className={classes.category_input} variant="outlined" displayEmpty error={!!errors?.d3}>
                    <MenuItem value="">-</MenuItem>
                    {normalCategoryList?.d3[watch("d2")]?.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                }
                name="d3"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
            </TableCell>
          ) : (
            <TableCell>
              <Controller
                as={<TextField variant="outlined" error={!!errors?.category_name} />}
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
            <Dropzone control={control} name="category_logo" width="90px" />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {category_pk === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(registCategory)}>
            추가
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit(updateCategory)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};
