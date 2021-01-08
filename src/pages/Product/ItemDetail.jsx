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
  RadioGroup,
  Radio,
} from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, Dropzone } from "components";

const useStyles = makeStyles((theme) => ({
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
  const { item_no } = useParams();
  const { control, reset, handleSubmit } = useForm();

  function handleAddItem(data) {
    console.log("add", data);
  }
  function handleUpdateItem(data) {
    console.log("update", data);
  }

  useEffect(() => {
    if (item_no !== "add") {
      reset({
        item_name: "알인스",
        category_type: 1,
        category_name: 2,
        item_material: "돌덩이",

        salesman_incentive: 1.4,
        can_use_accumulate: "1",
      });
    }
  }, [item_no]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          상품 {item_no === "add" ? "등록" : "정보"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>카테고리</TableCell>
          <TableCell>
            <Controller
              as={
                <TextField size="small" select variant="outlined">
                  <MenuItem value={1}>브랜드</MenuItem>
                  <MenuItem value={2}>제품군</MenuItem>
                </TextField>
              }
              name="category_type"
              control={control}
              defaultValue={1}
            />
            <Box display="inline-block" ml={2}>
              <Controller
                as={
                  <TextField size="small" select variant="outlined">
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
        </TableRow>
        <TableRow>
          <TableCell>상품명</TableCell>
          <TableCell>
            <Controller
              as={<TextField size="small" variant="outlined" />}
              placeholder="상품명"
              name="item_name"
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
                  name="normal_price.piece.price"
                  control={control}
                  rules={{ required: true }}
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
                  name="normal_price.box.price"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="normal_price.box.amount"
                  control={control}
                  rules={{ required: true }}
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
                  name="normal_price.carton.price"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="normal_price.carton.amount"
                  control={control}
                  rules={{ required: true }}
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
                  name="event_price.piece.price"
                  control={control}
                  rules={{ required: true }}
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
                  name="event_price.box.price"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_price.box.amount"
                  control={control}
                  rules={{ required: true }}
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
                  name="event_price.carton.price"
                  control={control}
                  rules={{ required: true }}
                  defaultValue=""
                />
                <Controller
                  as={<TextField variant="outlined" type="number" size="small" />}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">개입</InputAdornment>,
                  }}
                  placeholder="숫자만 입력"
                  name="event_price.carton.amount"
                  control={control}
                  rules={{ required: true }}
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
              name="item_material"
              control={control}
              rules={{ required: true }}
              defaultValue=""
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 대표 이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="item_main_img" width="90px" ratio={1} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>상품 설명 이미지</TableCell>
          <TableCell>
            <Dropzone control={control} name="item_desc_img" width="90px" ratio={1} />
            <Typography color="textSecondary">
              상품에 대한 상세한 설명 또는 브랜드에 관한 소개를 이미지로 업로드해주세요.
            </Typography>
          </TableCell>
        </TableRow>

        <TableRow>
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
        </TableRow>
        <TableRow>
          <TableCell>적립금 사용 가능 여부</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="1" control={<Radio color="primary" />} label="적립금 사용 가능 상품" />
                  <Box display="inline" ml={2}>
                    <FormControlLabel value="2" control={<Radio color="primary" />} label="적립금 사용 불가 상품" />
                  </Box>
                </RadioGroup>
              }
              name="can_use_accumulate"
              control={control}
              defaultValue="1"
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        {item_no === "add" ? (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleAddItem)}>
            게시
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSubmit(handleUpdateItem)}>
            수정
          </Button>
        )}
      </Box>
    </Box>
  );
};
