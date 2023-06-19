import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import {Box,makeStyles,TextField,Select,MenuItem,TableRow,TableCell,RadioGroup,FormControlLabel,Radio,} from "@material-ui/core";
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


  const [baseData, setBaseData] = useState(null);
  const [normalCategoryList, setNormalCategoryList] = useState();

  async function getCategoryDetail() {
    let data = await apiObject.getCategoryDetail({ category_pk, category_type: location.state?.category_type });
    setBaseData(data)
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
    if (!form.category_type) {
      alert("카테고리 구분을 선택해주세요");
      return;
    }else if (form.category_type === 'B' && !form.category_name) {
      alert("카테고리명을 선택해주세요");
      return;
    }else if (form.category_type === 'B' && !form.category_logo) {
        alert("카테고리 이미지를 추가해주세요");
        return;
    } else if (!window.confirm("입력한 정보로 카테고리를 추가하시겠습니까?")) {
      return;
    }

    if ( form.category_logo  ) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.category_logo, page: "product" });
      if (!paths.length) return;
      form.category_logo = paths?.[0];
    }

    if (form.category_type === "N") {
      let d3_item = null;
      if ( form.direct_d3 == null )  {
        d3_item = normalCategoryList.d3[form.d2].find((item) => item.code === form.d3);
        form.normalcategory_pk = d3_item.normalcategory_pk;
        form.category_name = d3_item.name;
      }else{
        form.normalcategory_pk = 'Direct';
        form.category_name = form.direct_d3;
      }
      if ( form?.d1 == 'Direct' && form?.direct_d1 == "" ) {
        alert("대카테고리명를 입력해주세요");
        return;
      }
      if ( form?.d2 == 'Direct' && form?.direct_d2 == "" ) {
        alert("중카테고리명를 입력해주세요");
        return;
      }
      if ( form?.d3 == 'Direct' && form?.direct_d3 == "" ) {
        alert("소카테고리명를 입력해주세요");
        return;
      }
    }
    console.log("dddd",form)
    await apiObject.registNewCategory({
      ...form,
      reg_member: member.member_pk,
    });
    history.push(`product/category`);
  }
  async function modifyCategory(form) {
    if (!form.category_type) {
      alert("카테고리 구분을 선택해주세요");
      return;
    }else if (form.category_type === 'B' && !form.category_name) {
      alert("카테고리명을 선택해주세요");
      return;
    }else if (form.category_type === 'B' && !form.category_logo) {
        alert("카테고리 이미지를 추가해주세요");
        return;
    } else if (!window.confirm("입력한 정보로 카테고리를 수정하시겠습니까?")) {
      return;
    }
    if ( form.category_type === 'B' ) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.category_logo, page: "product" });
      if (!paths.length) return;
      form.category_logo = paths?.[0];
    }
    if (form.category_type === "N") {
      //let d3_item = normalCategoryList.d3[form.d2].find((item) => item.code === form.d3);
      //form.normalcategory_pk = d3_item.normalcategory_pk;
      //form.category_name = d3_item.name;

      form.category_name = baseData?.category_name;
      form.normalcategory_pk = baseData?.normalcategory_pk;
  
    }
    console.log("dddd",form)
    await apiObject.modifyCategory({
      category_pk,
      ...form,
    });
    getCategoryDetail();
  }

  async function removeCategory(form) {
    alert("준비중입니다.");
    return;
    if (!window.confirm("카테고리를 삭제하시겠습니까?")) {
      return;
    }

    await apiObject.modifyCategory({
      category_pk,
    });
    history.push(`product/category`);
  }
  
  function onCategoryChange(name) {
    if (name === "d1") {
      setValue("d2", "");
      setValue("d3", "");
      setValue("direct_d2", "");
      setValue("direct_d3", "");
    } else if (name === "d2") {
      setValue("d3", "");
      setValue("direct_d3", "");
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
          <TableCell>사용여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup row {...props} onChange={(e) => onChange(e.target.value == "true")}>
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="미사용" />
                </RadioGroup>
              )}
              name="category_yn"
              control={control}
              defaultValue={true}
            />
          </TableCell>
        </TableRow>
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
            <TableCell >
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
                    <MenuItem value="Direct">직접입력</MenuItem>
                  </Select>
                )}
                name="d1"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              {watch("d1") == 'Direct' && 
                <Controller
                  as={<TextField error={!!errors?.direct_d1} />}
                  placeholder="대 카테고리명"
                  name="direct_d1"
                  control={control}
                  rules={{ required: false }}
                  defaultValue=""
                />
              }
              <br />
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
                    <MenuItem value="Direct">직접입력</MenuItem>
                  </Select>
                )}
                name="d2"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              {watch("d2") == 'Direct' && 
                <Controller
                  as={<TextField error={!!errors?.direct_d2} />}
                  placeholder="중 카테고리명"
                  name="direct_d2"
                  control={control}
                  rules={{ required: false }}
                  defaultValue=""
                />
              }
              <br />
              <Controller
                as={
                  <Select className={classes.category_input} displayEmpty error={!!errors?.d3}>
                    <MenuItem value="">-</MenuItem>
                    {normalCategoryList?.d3[watch("d2")]?.map((item, index) => (
                      <MenuItem key={index} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                    <MenuItem value="Direct">직접입력</MenuItem>
                  </Select>
                }
                name="d3"
                control={control}
                defaultValue=""
                rules={{ required: true }}
              />
              {watch("d3") == 'Direct' && 
                <Controller
                  as={<TextField error={!!errors?.direct_d3} />}
                  placeholder="소 카테고리명"
                  name="direct_d3"
                  control={control}
                  rules={{ required: false }}
                  defaultValue=""
                />
              }
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

        <TableRow>
          <TableCell>로고 이미지</TableCell>
          <TableCell>
            <Dropzone mb={1} control={control} name="category_logo" width="180px" />
            <Typography>1:1비율의 이미지를 업로드하는 것이 권장됩니다.(브랜드등록시 필수)</Typography>
          </TableCell>
        </TableRow>
      </RowTable>
      { watch("category_type") == "N"  && (
      <Box mt={4} textAlign="left">
        <Typography>제품군은 카테고리는 수정은 불가, 사용여부만 가능</Typography>
        <Typography>삭제시, 적용된 상품에서는 제거됩니다.</Typography>
      </Box>
      )}
      <Box mt={4} textAlign="center" display={'flex'} justifyContent="center" alignItems="center">
        {category_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registCategory)}>
            등록
          </Button>
        ) : (
          <>
          <Button color="primary" onClick={handleSubmit(modifyCategory)}>
            수정
          </Button>
          <Box mr={2} />
          <Button color="default" onClick={handleSubmit(removeCategory)}>
            삭제
          </Button>
          </>
          
        )}
      </Box>
    </Box>
  );
};
