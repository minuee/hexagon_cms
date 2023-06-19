import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";

import {makeStyles,Box,TextField,RadioGroup,Radio,FormControlLabel,TableRow,TableCell,Dialog,Checkbox,} from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { RowTable} from "components";


export const SetupPage = () => {
  const history = useHistory();
  const { control, register, setValue, handleSubmit, errors } = useForm();
 
  async function updateSetup(form) {
    
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
    let ret = await apiObject.getSetupdata();
  }

  async function getSetupdata() {
    let ret = await apiObject.getSetupdata();
	
    let data = ret?.baseInfo;
	  console.log('minuee',data);
    setValue("cs_phone",  data?.cs_phone);
	  setValue("cs_email",  data?.cs_email );
    setValue("main_deliver_name",  data?.main_deliver_name);
    setValue("main_deliver_phone",  data?.main_deliver_phone);
    setValue("main_deliver_use", data?.main_deliver_use ?  data?.main_deliver_use : false) 
    setValue("sub_deliver_1_name",  data?.sub_deliver_1_name);
    setValue("sub_deliver_1_phone",  data?.sub_deliver_1_phone);
    setValue("sub_deliver_1_use", data?.sub_deliver_1_use  ?  data?.sub_deliver_1_use : false) 
    setValue("sub_deliver_2_name",  data?.sub_deliver_2_name);
    setValue("sub_deliver_2_phone",  data?.sub_deliver_2_phone);
    setValue("sub_deliver_2_use", data?.sub_deliver_2_use  ?  data?.sub_deliver_2_use : false) 
    setValue("add_deliver_1_name",  data?.add_deliver_1_name);
    setValue("add_deliver_1_phone",  data?.add_deliver_1_phone);
    setValue("add_deliver_1_use", data?.add_deliver_1_use  ?  data?.add_deliver_1_use : false) 
    setValue("add_deliver_2_name",  data?.add_deliver_2_name);
    setValue("add_deliver_2_phone",  data?.add_deliver_2_phone);
    setValue("add_deliver_2_use", data?.add_deliver_2_use  ?  data?.add_deliver_2_use : false) 
    setValue("add_deliver_3_name",  data?.add_deliver_3_name);
    setValue("add_deliver_3_phone",  data?.add_deliver_3_phone);
    setValue("add_deliver_3_use", data?.add_deliver_3_use  ?  data?.add_deliver_3_use : false) 

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

      <Box mb={1} mt={1}>
      <Typography variant="h5" fontWeight="500">
        배송담당자
      </Typography>
    </Box>
    <RowTable>
        <TableRow>
          <TableCell>대표 담당자</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="main_deliver_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="main_deliver_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="main_deliver_use"
                control={control}
                defaultValue={true}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송 담당자 1</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="sub_deliver_1_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="sub_deliver_1_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="sub_deliver_1_use"
                control={control}
                defaultValue={true}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배송 담당자 2</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="sub_deliver_2_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="sub_deliver_2_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="sub_deliver_2_use"
                control={control}
                defaultValue={true}
              />
            </div>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>추가 담당자 1</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="add_deliver_1_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="add_deliver_1_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="add_deliver_1_use"
                control={control}
                defaultValue={true}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>추가 담당자 2</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="add_deliver_2_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="add_deliver_2_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="add_deliver_2_use"
                control={control}
                defaultValue={true}
              />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>추가 담당자 3</TableCell>
          <TableCell style={{display:'flex',flexDirection:'row'}}>
            <TextField
              size="small"
              name="add_deliver_3_name"
              placeholder="이름"
              inputRef={register({ required: false })}
            />
            <TextField
              size="small"
              name="add_deliver_3_phone"
              placeholder="연락처"
              inputRef={register({ required: false })}
            />
            <div style={{marginLeft:10}}>
              <Controller
                render={({ onChange, ...props }) => (
                  <RadioGroup {...props} onChange={(e) => onChange(JSON.parse(e.target.value))} row>
                    <FormControlLabel value={true} control={<Radio color="primary" />} label="사용" />
                    <Box display="inline" ml={2} />
                    <FormControlLabel value={false} control={<Radio color="primary" />} label="중지" />
                  </RadioGroup>
                )}
                name="add_deliver_3_use"
                control={control}
                defaultValue={true}
              />
            </div>
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

