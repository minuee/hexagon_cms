import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import _ from "lodash";

import { Box, makeStyles, TextField, Select, MenuItem, TableRow, TableCell } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  category_input: {
    width: theme.spacing(20),
    marginRight: theme.spacing(2),
  },
}));

export const CategoryDetail = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { member } = useSelector((state) => state.reducer);
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

  async function registCategory(form) {
    if (!form.category_logo) {
      alert("카테고리 이미지를 추가해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 카테고리를 추가하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({
      img_arr: form.category_logo,
      page: "product",
    });
    form.category_logo = paths?.[0];

    if (form.category_type !== "B") {
      let d3_item = _.find(normalCategoryList.d3[form.d2], (item) => item.code === form.d3);

      form.normalcategory_pk = d3_item.normalcategory_pk;
      form.category_name = d3_item.name;
    }

    await apiObject.registCategory({
      ...form,
      reg_member: member.member_pk,
    });
    history.push(`product/category`);
  }
  async function modifyCategory(form) {
    if (!form.category_logo) {
      alert("카테고리 이미지를 추가해주세요");
      return;
    } else if (!window.confirm("입력한 정보로 카테고리를 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({
      img_arr: form.category_logo,
      page: "product",
    });
    form.category_logo = paths?.[0];

    if (form.category_type !== "B") {
      let d3_item = _.find(normalCategoryList.d3[form.d2], (item) => item.code === form.d3);

      form.normalcategory_pk = d3_item.normalcategory_pk;
      form.category_name = d3_item.name;
    }

    await apiObject.modifyCategory({
      category_pk,
      ...form,
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
                  <Select className={classes.category_input} displayEmpty error={!!errors?.d3}>
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
                as={<TextField error={!!errors?.category_name} />}
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
            <Typography>1:1비율의 이미지를 업로드하는 것이 권장됩니다</Typography>
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {category_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registCategory)}>
            등록
          </Button>
        ) : (
          <Button color="primary" onClick={handleSubmit(modifyCategory)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};
