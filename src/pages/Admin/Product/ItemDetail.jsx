import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { price } from "common";
import { apiObject } from "api";
import dayjs from "dayjs";

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
  RadioGroup,
  Radio,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
  category_wrapper: {
    "& > *": {
      display: "inline-block",
      width: theme.spacing(20),
      marginRight: theme.spacing(2),
    },
  },
  price_cell: {
    display: "flex",
    alignItems: "center",

    "& > :first-child": {
      display: "inline-block",
      width: theme.spacing(10),
    },
    "& > :nth-child(2)": {
      display: "inline-flex",
      flexDirection: "column",

      "& > *": {
        width: theme.spacing(30),
      },
      "& > :nth-child(2)": {
        marginTop: theme.spacing(1),
      },
    },
  },
}));

export const ItemDetail = () => {
  const classes = useStyles();
  const { product_pk } = useParams();
  const { control, reset, setValue, watch, handleSubmit } = useForm();

  const [categoryList, setCategoryList] = useState();

  async function getCategoryList() {
    let data = await apiObject.getCategoryList({});

    setCategoryList(data);
  }
  async function getItemDetail() {
    let data = await apiObject.getItemDetail({ product_pk });

    console.log(data.category_pk);
    reset({
      ...data,
      material: data.material || "",
      thumb_img: [],
      detail_img: [],
    });
    setValue("category_pk", data.category_pk);
    setValue("thumb_img", data.thumb_img);
    setValue("detail_img", data.detail_img);
  }

  async function registItem(form) {
    if (!form.thumb_img || !form.detail_img) return;

    if (window.confirm("기재한 정보로 상품을 추가하시겠습니까?")) {
      let resp = await apiObject.registItem(form);
    }
  }
  async function updateItem(form) {
    if (!form.thumb_img || !form.detail_img) return;

    if (window.confirm("기재한 정보로 상품을 수정하시겠습니까?")) {
      let resp = await apiObject.updateItem({ form, product_pk });
    }
  }

  useEffect(() => {
    setValue("category_pk", "");
  }, [watch("category_type", "B")]);

  useEffect(() => {
    getCategoryList();
    if (product_pk !== "add") {
      getItemDetail();
    }
  }, [product_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          상품 {product_pk === "add" ? "등록" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>카테고리</TableCell>
          <TableCell>
            <Box className={classes.category_wrapper}>
              <Controller
                as={
                  <Select margin="dense" variant="outlined" displayEmpty>
                    <MenuItem value="">카테고리선택</MenuItem>
                    <MenuItem value="B">브랜드</MenuItem>
                    <MenuItem value="N">제품군</MenuItem>
                  </Select>
                }
                name="category_type"
                control={control}
                defaultValue={""}
              />

              {watch("category_type", "") === "B" && (
                <Controller
                  as={
                    <Select margin="dense" variant="outlined" displayEmpty>
                      <MenuItem value="">브랜드 선택</MenuItem>
                      {categoryList?.categoryBrandList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
              {watch("category_type", "") === "N" && (
                <Controller
                  as={
                    <Select margin="dense" variant="outlined" displayEmpty>
                      <MenuItem value="">제품군 선택</MenuItem>
                      {categoryList?.categoryNormalList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="category_pk"
                  control={control}
                  defaultValue={""}
                />
              )}
              {/* <Controller
                as={
                  <Select margin="dense" variant="outlined" displayEmpty>
                    <MenuItem value="">카테고리 선택</MenuItem>
                    {watch("category_type", "B") === "B" &&
                      categoryList?.categoryBrandList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                    {watch("category_type", "B") === "N" &&
                      categoryList?.categoryNormalList.map((item, index) => (
                        <MenuItem value={item.category_pk} key={index}>
                          {item.category_name}
                        </MenuItem>
                      ))}
                  </Select>
                }
                name="category_pk"
                control={control}
                defaultValue={""}
              /> */}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품명</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" variant="outlined" />}
              placeholder="상품명"
              name="product_name"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={3}>가격</TableCell>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>개당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="each_price"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>박스당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="box_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="box_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>카톤당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="carton_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="carton_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell rowSpan={3}>이벤트가</TableCell>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>개당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_each_price"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>박스당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_box_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_box_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Box className={classes.price_cell}>
              <Typography>카톤당</Typography>
              <Box>
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">원</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_carton_price"
                  control={control}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_carton_unit"
                  control={control}
                  defaultValue=""
                />
              </Box>
            </Box>
          </TableCell>
        </TableRow>

        {/* <TableRow>
          <TableCell>제조사</TableCell>
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
            <Box display="inline-block" ml={2}>
              <Controller
                as={
                  <TextField select variant="outlined">
                    <MenuItem value={1}>아릭스</MenuItem>
                    <MenuItem value={2}>드라이팍</MenuItem>
                    <MenuItem value={3}>라코로나</MenuItem>
                    <MenuItem value={4}>클로린직</MenuItem>
                    <MenuItem value={5}>톤키타</MenuItem>
                  </TextField>
                }
                name="category_name"
                control={control}
                defaultValue={1}
              />
            </Box>
          </TableCell>
        </TableRow> */}
        <TableRow>
          <TableCell>재질</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" variant="outlined" />}
              placeholder="재질명"
              name="material"
              control={control}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 대표 이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="thumb_img" width="90px" ratio={1} minFiles={1} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 설명 이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="detail_img" width="90px" ratio={1} maxFiles={4} />
            <Typography color="textSecondary">
              상품에 대한 상세한 설명 또는 브랜드에 관한 소개를 4개까지 이미지로 업로드해주세요.
            </Typography>
          </TableCell>
        </TableRow>

        {/* <TableRow>
          <TableCell>영업사원 인센티브</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" variant="outlined" type="number" />}
              InputProps={{
                endAdornment: "%",
              }}
              placeholder="숫자만 입력"
              name="salesman_incentive"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow> */}
        <TableRow>
          <TableCell>품절 여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="재고있음" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="품절" />
                </RadioGroup>
              )}
              name="is_soldout"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>적립금 사용 가능 여부</TableCell>
          <TableCell>
            <Controller
              render={({ onChange, ...props }) => (
                <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                  <FormControlLabel value={false} control={<Radio color="primary" />} label="적립금 사용 가능 상품" />
                  <Box display="inline" ml={2} />
                  <FormControlLabel value={true} control={<Radio color="primary" />} label="적립금 사용 불가 상품" />
                </RadioGroup>
              )}
              name="is_nonpoint"
              control={control}
              defaultValue={false}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {product_pk === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(registItem)}>
            게시
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit(updateItem)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};