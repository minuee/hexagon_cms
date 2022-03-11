import React, { useState, useEffect,useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import dayjs from "dayjs";
import styled, { css } from "styled-components";
import { CircularProgress,Box, makeStyles, TextField, InputAdornment, TableRow, TableCell ,IconButton} from "@material-ui/core";
import { Add,Close,EventNote } from "@material-ui/icons";
import { DateTimePicker } from "@material-ui/pickers";
import { Typography, Button } from "components/materialui";
import { RowTable, Dropzone,ImageBox } from "components";
import { getFullImgURL } from "common";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const useStyles = makeStyles((theme) => ({
  editorContainer: {
    '& .ck.ck-content.ck-editor__editable': {
      maxHeight: '30vh',
      minHeight: '30vh',
    },
  },
  clear_button: {
    position: "relative",
    cursor: "pointer",
  },
}));

export const WebNoticeDetail = () => {
  const history = useHistory();
  const fileInput = React.useRef();
  const classes = useStyles();
  const { notice_pk } = useParams();
  const { control, register, reset, setValue, handleSubmit, errors } = useForm();
  const [isLoading, setLoading] = useState(false);
  
  const [pushHistory, setPushHistory] = useState([]);
  const [addFile, setAddFile] = useState({
    isUploadFile1 : false,
    file_name: null,
    file: null,
  });
  const [content, setContent] = useState(null);
  const [content_en, setContentEn] = useState(null);
  async function getNoticeDetail() {
    let ret = await apiObject.getWebNoticeDetail({ notice_pk });
    setPushHistory(ret?.pushLog);

    let data = ret?.noticeDetail;
    reset({
      ...data,
      start_dt: dayjs.unix(data.start_dt),
      img_url: [],
      upload_file1 : []
    });
    setContent(data.content);
    setContentEn(data.content_en);
    setValue("img_url", [{ file: null, path: data.img_url }]);
    setAddFile({
      isUploadFile1 : data.file1_url != null ? true : false,
      file_name: data.file1_url,
      real_filename : data.file1_name,
      file: null,
    });
    //setLoading(false)
    fileInput.current.value = "";
  }
  async function registerNotice(form) {
    if (!window.confirm("입력한 정보로 공지를 등록하시겠습니까??")) return;
    if (form.img_url) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.img_url, page: "webimg" });
      if (!paths.length) return;
      form.img_url = paths?.[0];
    }
    if (addFile.isUploadFile1) {
      let paths = await apiObject.uploadFileSingle({ file_arr: addFile, page : 'webnfile'});
      if (!paths.length) return;
      form.file1 = paths?.[0];
      form.file1_name = addFile.real_filename || 'noname';
    }

    await apiObject.registWebNotice({
      ...form,
      content,
      content_en,
      start_dt: form.start_dt?.unix(),
    });

    history.push("/webnotice");
  }
  async function modifyNotice(form) {
    
    if (!window.confirm("입력한 정보로 공지를 수정하시겠습니까?")) return;

    if (form.img_url) {
      let paths = await apiObject.uploadImageMultiple({ img_arr: form.img_url, page: "etc" });
      if (!paths.length) return;
      form.img_url = paths?.[0];
    }

    if (addFile.file != undefined) {
      let paths = await apiObject.uploadFileSingle({ file_arr: addFile, page : 'webnotice'});
      if (!paths.length) return;
      form.file1 = paths;
      form.file1_name = addFile.real_filename || 'noname';
    }else{
      form.file1 = addFile.file_name;
      form.file1_name = addFile.real_filename; 
    }
    //console.log('modifyWebNotice',form)
    await apiObject.modifyWebNotice({
      notice_pk,
      content,
      content_en,
      ...form,
      start_dt: form.start_dt?.unix(),
    });
    history.push("/webnotice");
  }
  async function removeNotice() {
    if (!window.confirm("공지를 삭제하시겠습니까?")) return;

    await apiObject.removeWebNotice({ notice_pk });
    history.push("/webnotice");
  }

  useEffect(() => {
    if (notice_pk !== "add") {
      getNoticeDetail();
    }
  }, [notice_pk]);

  async function fileDowload(file_url) {


  }
  const handleAddPdfUpload = useCallback(
    ({ target }) => {
      console.log('target',target.files[0])
      setAddFile({
        isUploadFile1 : false,
        file_name: target.files[0].name,
        real_filename: target.files[0].name,
        file: target.files[0],
      });
      fileInput.current.value = "";
    },
    [fileInput]
  );

  const handleRemoveAddFile = useCallback(
    () => {
      if (!window.confirm("첨부파일을 삭제하시겠습니까?")) return;
      setAddFile({
        isUploadFile1 : false,
        file_name: null,
        file: null,
      });
    },
    []
  );

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          홈페이지 공지사항 관리
        </Typography>
      </Box>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
      <RowTable>
        <TableRow>
          <TableCell>공개 일시</TableCell>
          <TableCell>
            <Controller
              render={({ ref, ...props }) => (
                <DateTimePicker
                  {...props}
                  inputRef={ref}
                  format={`YYYY.MM.DD  HH:mm`}
                  minutesStep={10}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <EventNote />
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors?.start_dt}
                  disablePast
                />
              )}
              name={"start_dt"}
              control={control}
              defaultValue={null}
              rules={{ required: true }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>제목(국문)</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="title"
              placeholder="공지 제목을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.title}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>제목(영문)</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="title_en"
              placeholder="공지 제목을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.title_en}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>내용(국문)</TableCell>
          <TableCell>
           {/*  <TextField
              size="small"
              fullWidth
              multiline
              rows={10}
              name="content"
              placeholder="공지 내용을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.content}
            /> */}
            
            <Box mb={2.5} className={classes.editorContainer}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  removePlugins: [
                    'Link',
                    'Image',
                    'Table',
                    'ImageCaption',
                    'ImageStyle',
                    'ImageToolbar',
                    'ImageUpload',
                    'MediaEmbed',
                  ],
                }}
                data={content}
                onChange={(event, editor) => {
                  setContent(editor.getData());
                }}
                
              />
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
        <TableCell>내용(영문)</TableCell>
        <TableCell>
          <Box mb={2.5} className={classes.editorContainer}>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  removePlugins: [
                    'Link',
                    'Image',
                    'Table',
                    'ImageCaption',
                    'ImageStyle',
                    'ImageToolbar',
                    'ImageUpload',
                    'MediaEmbed',
                  ],
                }}
                data={content_en}
                onChange={(event, editor) => {
                  setContentEn(editor.getData());
                }}
                
              />
            </Box>
        </TableCell>
      </TableRow>
        <TableRow>
          <TableCell>이미지</TableCell>
          <TableCell>
            <Dropzone mb={1} control={control} name="img_url" width="180px" ratio={1} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>파일첨부</TableCell>
          <TableCell>
            <label htmlFor="add-pdf" style={{display:'flex',alignItems:'center'}}>
              <PdfUploadDiv>
                {addFile === null ? "File Upload" : addFile?.real_filename}
                <input 
                  ref={fileInput} 
                  type="file" 
                  onChange={handleAddPdfUpload}
                  //style={{ display: 'none' }} 
                />
                
              </PdfUploadDiv>
              {addFile.isUploadFile1 && 
                <FileDownloadDiv >       
                  <a href={getFullImgURL(addFile.file_name)}>   
                  <ImageBox src={'/image/press_download_icon.png'} display="inline-block" width="16px" height="16px" />
                  </a>    
                </FileDownloadDiv>
              }
              {addFile.file_name && 
                <FileDownloadDiv >
                  <IconButton className={classes.clear_button} onClick={() => handleRemoveAddFile()}>
                    <Close />
                  </IconButton>
                </FileDownloadDiv>
              }
            </label>
          </TableCell>
        </TableRow>
      </RowTable>
      )
      }

      <Box mt={4} display="flex" justifyContent="center" alignItems="flex-start">
        <Button mr={2} onClick={() => history.push("/webnotice")}>
          목록
        </Button>

        {notice_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registerNotice)}>
            등록
          </Button>
        ) : (
          <>
            <Button color="primary" onClick={handleSubmit(modifyNotice)}>
              수정
            </Button>
            <Button mx={2} color="secondary" onClick={removeNotice}>
              삭제
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};


const PdfUploadDiv = styled.div`
  width: 80%;
  height: 35px;
  margin-right:10px;
  border-radius: 5px;
  font-size: 16px;
  border: 1px solid #dddddd;
  color: #999999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  cursor: pointer;
`;
const FileDownloadDiv = styled.div`
  width: 9%;
  height: 35px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;


const PdfUploadBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 5px;
  background-color: #7ea1b2;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    max-width: 16px;
  }
`;
