import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import dayjs from "dayjs";
import { price } from "common";
import { Box, TextField, Select, MenuItem, TableRow, TableCell } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable } from "components";

export const PointDetail = () => {
  const history = useHistory();
  const { point_pk } = useParams();
  const { control, register,watch, reset, setValue,handleSubmit, errors } = useForm();

  const [pointDetail, setPointDetail] = useState();
  const [isTerminated, setIsTerminated] = useState(false);

  async function getPointDetail() {
    console.log('minuee',point_pk)
    let data = await apiObject.getPointDetail({ point_pk });
    setIsTerminated( data.remain_point > 0 && data.use_enddate < dayjs().unix());
    console.log('minuee',{data})
    setPointDetail(data);
    reset({
      ...data,
      use_enddate: dayjs.unix(data.use_enddate),
    });
    //setValue("update_reason", data.update_reason);
  }
  async function modifyPoint(form) {
    if ( form.content == ""  ) {
      alert("지급사유를 입력하셔야 합니다.");
      return;
    }else{
      if (!window.confirm("입력한 정보를 수정하시겠습니까?")) return;

      await apiObject.modifyPoint({
        ...form,
        point_pk : parseInt(point_pk),
        use_enddate: form.use_enddate?.unix(),
        member_pk: pointDetail?.member_pk,
        reserve_pk : pointDetail.reserve_pk,
        reward_point : form.reward_point,
        content : form.content,
        remain_point : (form.reward_point - ( pointDetail.reward_point - pointDetail.remain_point))
      });

      getPointDetail();
    }
  }
  async function removePoint() {
    if (!window.confirm("포인트 지급을 삭제하시겠습니까?")) return;

    await apiObject.removePoint({ point_pk });
    history.push("/point");
  }

  useEffect(() => {
    getPointDetail();
  }, [point_pk]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          포인트 상세정보
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>대상자</TableCell>
          <TableCell>
            <Typography>{pointDetail?.member_name}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>지급 포인트</TableCell>
          <TableCell>
            { ( !isTerminated  && pointDetail?.special_code == null ) ? (
              <TextField
                  size="small"
                  type={'number'}
                  name="reward_point"
                  defaultValue={pointDetail?.reward_point}
                  inputRef={register({ required: true })}
                  error={!!errors.reward_point}
                />
            ) :
              <Typography>{price(pointDetail?.reward_point)}</Typography>
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>미사용 포인트</TableCell>
          <TableCell>
            <Typography>{price(pointDetail?.remain_point)}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{!isTerminated ? "사용가능일자" : "발급일자"}</TableCell>
          <TableCell>
            <Box display="flex" alignItems="center">
              <Typography display="inline">{dayjs.unix(pointDetail?.reg_dt).format("YYYY.MM.DD")}</Typography>

              {!isTerminated && (
                <>
                  <Box mx={2} display="inline">
                    ~
                  </Box>

                  <Controller
                    render={({ ref, ...props }) => (
                      <DatePicker
                        {...props}
                        inputRef={ref}
                        format="YYYY.MM.DD"
                        size="small"
                        disabled={isTerminated}
                        disablePast
                      />
                    )}
                    control={control}
                    name="use_enddate"
                    defaultValue={dayjs().add(90, "day")}
                  />
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>

        {!isTerminated ? (
          <TableRow>
            <TableCell>지급사유</TableCell>
            <TableCell>
              <TextField
                fullWidth
                name="content"
                defaultValue={pointDetail?.content}
                inputRef={register({ required: true })}
                error={!!errors.content}
              />
            </TableCell>
          </TableRow>
        )
        :
        <TableRow>
          <TableCell>지급사유</TableCell>
          <TableCell>{pointDetail?.content}</TableCell>
        </TableRow>
        }
      </RowTable>

      <Box mt={4} textAlign="center">
        <Button onClick={() => history.push("/Point")}>목록</Button>
        { ( !isTerminated  && pointDetail?.special_code == null ) && (
            <Button ml={2} color="primary" onClick={handleSubmit(modifyPoint)}>
              수정
            </Button>
        )}
        { ( !isTerminated  && pointDetail?.special_code == null && pointDetail?.reward_point == pointDetail?.remain_point ) && (
            <Button ml={2} color="secondary" onClick={removePoint}>
              삭제
            </Button>
        )}
      </Box>
      <Box mt={4} mb={10}>
        
          <Box color="#777" mt={1}>
           * 사용가능일자 및 미사용포인트가 1이상일때만 수정가능
          </Box>
          <Box color="#777" mt={1}>
           * 미사용포인트와 지급포인트가 동일할때만 삭제가능
          </Box>
          <Box color="#777" mt={1}>
           * 회워초대는 수정/삭제 불가
          </Box>
      </Box>
    </Box>
  );
};
