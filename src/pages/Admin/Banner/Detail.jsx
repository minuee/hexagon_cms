import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { apiObject } from "api";
import { price, getFullImgURL } from "common";
import dayjs from "dayjs";

import {
  Box,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  TableRow,
  TableCell,
  FormControlLabel,
  RadioGroup,
  Radio,
  Dialog,
  IconButton,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, RowTable, Pagination, SearchBox, Dropzone, ImageBox } from "components";

const useStyles = makeStyles((theme) => ({
  modal_close_icon: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

export const BannerDetail = ({ location }) => {
  const history = useHistory();
  const { banner_pk } = useParams();
  const { control, register, reset, setValue, watch, handleSubmit, errors } = useForm();

  const [isInlinkModalOpen, setIsInlinkModalOpen] = useState(false);

  async function getBannerDetail() {
    let data = await apiObject.getBannerDetail({
      banner_pk,
      link_type: location.state?.link_type,
      inlink_type: location.state?.inlink_type,
    });

    reset({
      ...data,
      banner_img: [],
    });
    setValue("banner_img", [{ file: null, path: data.img_url }]);
  }

  async function registBanner(form) {
    if (!form.banner_img) {
      alert("배너이미지를 선택해주세요");
      return;
    }
    if (!window.confirm("입력한 내용으로 배너를 등록하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.banner_img, page: "etc" });
    if (!paths.length) return;

    await apiObject.registBanner({
      ...form,
      target_pk: form.target?.target_pk,
      img_url: paths?.[0],
    });

    history.push("/banner");
  }
  async function modifyBanner(form) {
    if (!form.banner_img) {
      alert("배너이미지를 선택해주세요");
      return;
    }
    if (!window.confirm("입력한 내용으로 배너를 수정하시겠습니까?")) {
      return;
    }

    let paths = await apiObject.uploadImageMultiple({ img_arr: form.banner_img, page: "etc" });
    if (!paths.length) return;

    await apiObject.modifyBanner({
      banner_pk,
      ...form,
      target_pk: form.target?.target_pk,
      img_url: paths?.[0],
    });

    if (location.state?.link_type != form.link_type || location.state?.inlink_type != form.inlink_type) {
      history.replace({
        pathname: window.location.pathname,
        state: {
          inlink_type: form.inlink_type,
          link_type: form.link_type,
        },
      });
    } else {
      getBannerDetail();
    }
  }
  async function removeBanner() {
    if (!window.confirm("현재 배너를 삭제하시겠습니까?")) return;

    await apiObject.removeBanner({ banner_pk });
    history.push("/banner");
  }

  useEffect(() => {
    if (banner_pk !== "add") {
      getBannerDetail();
    }
  }, [banner_pk, location.state?.link_type, location.state?.inlink_type]);

  return (
    <Box>
      <Box mb={1}>
        <Typography variant="h5" fontWeight="500">
          배너 {banner_pk === "add" ? "등록" : "상세"}
        </Typography>
      </Box>

      <RowTable>
        <TableRow>
          <TableCell>링크타입</TableCell>
          <TableCell>
            <Controller
              as={
                <RadioGroup row>
                  <FormControlLabel value="INLINK" control={<Radio color="primary" />} label="앱내이동" />
                  <FormControlLabel value="OUTLINK" control={<Radio color="primary" />} label="브라우저호출" />
                </RadioGroup>
              }
              name="link_type"
              control={control}
              defaultValue="INLINK"
            />
          </TableCell>
        </TableRow>
        {watch("link_type", "INLINK") === "INLINK" && (
          <>
            <TableRow>
              <TableCell>배너타입</TableCell>
              <TableCell>
                <Controller
                  render={({ onChange, ...props }) => (
                    <RadioGroup
                      {...props}
                      onChange={(e) => {
                        onChange(e);
                        setValue("target", null);
                      }}
                      row
                    >
                      <FormControlLabel value="PRODUCT" control={<Radio color="primary" />} label="상품" />
                      <FormControlLabel value="CATEGORY" control={<Radio color="primary" />} label="카테고리" />
                      <FormControlLabel value="EVENT" control={<Radio color="primary" />} label="이벤트" />
                    </RadioGroup>
                  )}
                  name="inlink_type"
                  control={control}
                  defaultValue="PRODUCT"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>링크대상선택</TableCell>
              <TableCell>
                <Controller
                  render={({ value }) => (
                    <Box display="flex" alignItems="center">
                      {watch("inlink_type", "PRODUCT") === "PRODUCT" && value && (
                        <ImageBox
                          width="100px"
                          height="100px"
                          mr={1}
                          display="inline-block"
                          src={getFullImgURL(value?.thumb_img)}
                        />
                      )}
                      <Typography display="inline">{value?.name || "적용 대상을 선택해주세요"}</Typography>
                    </Box>
                  )}
                  control={control}
                  name="target"
                  defaultValue={null}
                  rules={{ required: watch("link_type") === "INLINK" }}
                  error={!!errors?.target}
                />
                <Button mt={2} size="large" onClick={() => setIsInlinkModalOpen(true)}>
                  링크대상선택
                </Button>
              </TableCell>
            </TableRow>
          </>
        )}
        {watch("link_type", "INLINK") === "OUTLINK" && (
          <TableRow>
            <TableCell>외부브라우저 링크</TableCell>
            <TableCell>
              <TextField
                size="small"
                fullWidth
                name="target_url"
                placeholder="링크의 전체 URL을 입력해주세요"
                inputRef={register({ required: watch("link_type") === "OUTLINK" })}
                error={!!errors?.target_url}
              />
            </TableCell>
          </TableRow>
        )}

        <TableRow>
          <TableCell>제목</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              name="title"
              placeholder="제목을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.title}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>내용</TableCell>
          <TableCell>
            <TextField
              size="small"
              fullWidth
              multiline
              rows={10}
              name="content"
              placeholder="내용을 입력해주세요"
              inputRef={register({ required: true })}
              error={!!errors?.content}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>배너이미지</TableCell>
          <TableCell>
            <Dropzone
              mb={1}
              control={control}
              name="banner_img"
              width="180px"
              ratio={1.33}
              zoomable
              croppable={{ minWidth: 512 }}
            />
            <Typography>가로X세로(4:3)비율의 이미지를 업로드하는 것이 권장됩니다</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>노출순서</TableCell>
          <TableCell>
            <Controller
              render={({ value }) => <Typography>{value || "자동으로 가장 낮은 순위가 배정됩니다"}</Typography>}
              control={control}
              name="display_seq"
              defaultValue=""
            />
          </TableCell>
        </TableRow>
      </RowTable>

      <Box mt={4} display="flex" justifyContent="center" alignItems="flex-start">
        {banner_pk === "add" ? (
          <Button color="primary" onClick={handleSubmit(registBanner)}>
            등록
          </Button>
        ) : (
          <>
            <Button color="primary" onClick={handleSubmit(modifyBanner)}>
              수정
            </Button>
            <Button mx={2} color="secondary" onClick={handleSubmit(removeBanner)}>
              삭제
            </Button>
          </>
        )}
      </Box>

      <InlinkModal
        open={isInlinkModalOpen}
        onClose={() => setIsInlinkModalOpen(false)}
        onSelect={(target) => setValue("target", target)}
        inlinkType={watch("inlink_type", "PRODUCT")}
        selected_item={watch("target", null)}
      />
    </Box>
  );
};

const InlinkModal = ({ open, onClose, onSelect, inlinkType, selected_item }) => {
  const classes = useStyles();
  const { control, watch, setValue } = useForm();

  const [selectedItem, setSelectedItem] = useState();
  const [categoryList, setCategoryList] = useState();
  const [inlinkColumn, setInlinkColumn] = useState([]);
  const [inlinkList, setInlinkList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_word: "",
    category_type: "B",
    category_pk: "",
    filter_item: "",
  });

  const product_columns = [
    {
      title: "상품 이미지",
      render: ({ thumb_img }) => (
        <ImageBox src={getFullImgURL(thumb_img)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_yn }) => (category_yn ? "브랜드" : "제품군"), width: 120 },
    { title: "카테고리명", field: "category_name" },
    { title: "상품명", field: "product_name", cellStyle: { textAlign: "left" } },
    {
      title: "가격",
      render: ({ each_price, box_price, carton_price }) => (
        <>
          {each_price !== 0 && <p>{`낱개(${price(each_price)})`}</p>}
          {box_price !== 0 && <p>{`박스(${price(box_price)})`}</p>}
          {carton_price !== 0 && <p>{`카톤(${price(carton_price)})`}</p>}
        </>
      ),
    },
    {
      title: "상품 정보",
      render: ({ product_pk }) => (
        <Button color="primary" onClick={() => window.open(`${window.location.origin}/product/item/${product_pk}`)}>
          정보
        </Button>
      ),
      width: 100,
      disableClick: true,
    },
  ];
  const category_columns = [
    {
      title: "로고",
      render: ({ category_logo }) => (
        <ImageBox src={getFullImgURL(category_logo)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군"), width: 120 },
    {
      title: "카테고리명",
      render: (props) =>
        props.category_type === "N"
          ? `${props.depth1name} > ${props.depth2name} > ${props.depth3name}`
          : props.category_name,
    },
  ];
  const event_columns = [
    { title: "번호", field: "event_pk", width: 80 },
    { title: "종류", field: "event_gubun_text", width: 160 },
    { title: "제목", field: "title", cellStyle: { textAlign: "left" } },
    {
      title: "등록일",
      render: ({ reg_dt }) => dayjs.unix(reg_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    {
      title: "시작일",
      render: ({ start_dt }) => dayjs.unix(start_dt).format("YYYY-MM-DD"),
      width: 120,
    },
    { title: "종료여부", render: ({ termination_yn }) => (termination_yn ? "Y" : "N"), width: 100 },
  ];

  async function getInlinkList() {
    let data;

    switch (inlinkType) {
      case "PRODUCT":
        setInlinkColumn(product_columns);
        data = await apiObject.getProductList({ ...listContext });
        break;
      case "CATEGORY":
        setInlinkColumn(category_columns);
        let tmp = await apiObject.getCategoryList({ ...listContext });

        if (listContext.category_type === "B") {
          data = tmp.categoryBrandList;
        } else {
          data = tmp.categoryNormalList;
        }
        break;
      case "EVENT":
        setInlinkColumn(event_columns);
        data = await apiObject.getEventList({ ...listContext });
        break;

      default:
        setInlinkColumn([]);
        break;
    }

    setInlinkList(data);
  }

  async function handleOnEnter() {
    if (inlinkType === "PRODUCT") {
      let data = await apiObject.getCategoryList({});
      setCategoryList(data);
    }
  }

  function isCurItem(row) {
    let row_pk;

    switch (inlinkType) {
      case "PRODUCT":
        row_pk = row.product_pk;
        break;
      case "CATEGORY":
        row_pk = row.category_pk;
        break;
      case "EVENT":
        row_pk = row.event_pk;
        break;
    }

    return row_pk == selectedItem?.target_pk;
  }
  function handleOnSelect(target) {
    switch (inlinkType) {
      case "PRODUCT":
        target.name = target.product_name;
        target.target_pk = target.product_pk;
        break;
      case "CATEGORY":
        if (listContext.category_type === "B") {
          target.name = target.category_name;
        } else {
          target.name = `${target.depth1name} > ${target.depth2name} > ${target.depth3name}`;
        }
        target.target_pk = target.category_pk;
        break;
      case "EVENT":
        target.name = target.title;
        target.target_pk = target.event_pk;
        break;
    }

    setSelectedItem(target);
    onSelect(target);
    onClose();
    setListContext({
      page: 1,
      search_word: "",
      category_type: "B",
      category_pk: "",
      filter_item: "",
    });
  }
  function handleContextChange(name, value) {
    let tmp = {
      ...listContext,
      [name]: value,
    };
    if (name != "page") {
      tmp.page = 1;
    }

    setListContext(tmp);
  }

  useEffect(() => {
    if (open) {
      getInlinkList();
    }
  }, [inlinkType, listContext, open]);
  useEffect(() => {
    setValue("category_pk", "");
    handleContextChange("category_pk", "");
  }, [watch("category_type", "")]);

  useEffect(() => {
    setSelectedItem(selected_item);
  }, [selected_item]);

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={onClose} onBackdropClick={onClose} onEnter={handleOnEnter}>
      <IconButton className={classes.modal_close_icon} onClick={onClose}>
        <Close fontSize="large" />
      </IconButton>

      <Box p={3} height="800px" bgcolor="#fff">
        <Typography variant="h6" fontWeight="700">
          링크 {inlinkType === "PRODUCT" ? "상품" : inlinkType === "CATEGORY" ? "카테고리" : "이벤트"} 선택
        </Typography>

        <Box my={2} display="flex" justifyContent="space-between" alignItems="center">
          {inlinkType === "PRODUCT" && (
            <Box>
              <Box mr={1} display="inline-block">
                <Controller
                  as={
                    <Select displayEmpty margin="dense">
                      <MenuItem value="">카테고리 구분</MenuItem>
                      <MenuItem value="B">브랜드</MenuItem>
                      <MenuItem value="N">제품군</MenuItem>
                    </Select>
                  }
                  control={control}
                  name="category_type"
                  defaultValue=""
                />
              </Box>

              {watch("category_type", "") === "B" && (
                <Select
                  displayEmpty
                  margin="dense"
                  value={listContext.category_pk}
                  onChange={(e) => handleContextChange("category_pk", e.target.value)}
                >
                  <MenuItem value="">카테고리 분류</MenuItem>
                  {categoryList?.categoryBrandList.map((item, index) => (
                    <MenuItem value={item.category_pk} key={index}>
                      {item.category_name}
                    </MenuItem>
                  ))}
                </Select>
              )}
              {watch("category_type", "") === "N" && (
                <Select
                  displayEmpty
                  margin="dense"
                  value={listContext.category_pk}
                  onChange={(e) => handleContextChange("category_pk", e.target.value)}
                >
                  <MenuItem value="">카테고리 분류</MenuItem>
                  {categoryList?.categoryNormalList.map((item, index) => (
                    <MenuItem value={item.category_pk} key={index}>
                      {`${item.depth1name}  >  ${item.depth2name}  >  ${item.depth3name}`}
                    </MenuItem>
                  ))}
                </Select>
              )}

              <Box ml={1} display="inline-block">
                <Typography>등록 상품 수: {inlinkList?.[0]?.total}</Typography>
              </Box>
            </Box>
          )}
          {inlinkType === "CATEGORY" && (
            <Select
              name="category_type"
              margin="dense"
              value={listContext.category_type}
              onChange={(e) => handleContextChange("category_type", e.target.value)}
            >
              <MenuItem value={"B"}>브랜드</MenuItem>
              <MenuItem value={"N"}>제품군</MenuItem>
            </Select>
          )}
          {inlinkType === "EVENT" && (
            <Select
              margin="dense"
              displayEmpty
              value={listContext.filter_item}
              onChange={(e) => handleContextChange("filter_item", e.target.value)}
            >
              <MenuItem value="">전체</MenuItem>
              <MenuItem value="N">진행중</MenuItem>
              <MenuItem value="Y">마감</MenuItem>
            </Select>
          )}

          <SearchBox
            defaultValue=""
            placeholder={`${
              inlinkType === "PRODUCT" ? "상품" : inlinkType === "CATEGORY" ? "카테고리" : "이벤트"
            } 검색`}
            onSearch={handleContextChange}
          />
        </Box>

        <ColumnTable
          columns={inlinkColumn}
          data={inlinkList}
          onRowClick={handleOnSelect}
          options={{
            rowStyle: (row) => ({
              background: isCurItem(row) && "#bbb",
            }),
          }}
        />

        <Box py={4} position="relative" display="flex" alignItems="center" justifyContent="flex-end">
          <Pagination
            page={listContext.page}
            setPage={handleContextChange}
            count={Math.ceil(inlinkList?.[0]?.total / 10) || 1}
          />
        </Box>
      </Box>
    </Dialog>
  );
};
