import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { apiObject } from "api";

import {makeStyles,Box,TextField,Select,MenuItem,IconButton,TableRow,TableCell,Dialog,Checkbox,} from "@material-ui/core";
import { HighlightOff, Close } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { RowTable, ColumnTable, Pagination, SearchBox } from "components";


export const SetupPage = () => {
  const history = useHistory();
  const { control, register, setValue, handleSubmit, errors } = useForm();



  async function updateSetup(form) {
	console.log('ddddd',form)
    if (!form.cs_phone) {
      alert("고객센터 연락처를 입력하세요");
      return;
	}else if (!form.cs_email) {
		alert("이메일주소를 입력하세요");
		return;
    } else if (!window.confirm("정보를 수정하시겠습니까?")) {
      return;
    }


    await apiObject.updateSetup({
      ...form,
    });

    history.push("/setup");
  }

  async function getSetupdata() {
    let ret = await apiObject.getSetupdata();
	
    let data = ret?.baseInfo;
	console.log('data.cs_phone',data.cs_email);
    setValue("cs_phone",  data.cs_phone != undefined ? data.cs_phone : '');
	setValue("cs_email",  data.cs_email != undefined ? data.cs_email : '');
  }

  useEffect(() => {
    getSetupdata();
  }, []);


  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          환경설정
        </Typography>
      </Box>
      <RowTable>
        <TableRow>
          <TableCell>고객센터 연락처</TableCell>
          <TableCell>
            <TextField
              size="small"
			  fullWidth
              name="cs_phone"
              placeholder="판매용앱에 사용할 고객센터 연락처"
              inputRef={register({ required: true })}
              error={!!errors?.cs_phone}
            />
          </TableCell>
        </TableRow>
		<TableRow>
          <TableCell>고객센터 이메일</TableCell>
          <TableCell>
            <TextField
              size="small"
			  fullWidth
              name="cs_email"
              placeholder="판매용앱에 사용할 고객센터 이메일"
              inputRef={register({ required: true })}
              error={!!errors?.cs_email}
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} textAlign="center">
        <Button color="primary" onClick={handleSubmit(updateSetup)}>
          수정
        </Button>
      </Box>

      
    </Box>
  );
};

