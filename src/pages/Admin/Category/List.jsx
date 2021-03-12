import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { getFullImgURL } from "common";
import { useQuery } from "hooks";

import { Grid, Box, makeStyles, InputAdornment, Select, MenuItem } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, ImageBox, ExcelExportButton, DnDList } from "components";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: theme.spacing(3),

    "& > *": {
      display: "flex",
      alignItems: "center",
    },

    "& .MuiInputBase-root": {
      width: theme.spacing(25),
      background: "#fff",
    },
  },

  logo_box: {
    display: "inline-block",
    width: "60px",
    height: "60px",

    "& img": {
      objectFit: "contain",
    },
  },

  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  search_section: {
    "& > *": {
      background: "#fff",
    },
  },

  dnd_container: {
    background: "#fff",

    "& th": {
      background: "#ddd",
      fontWeight: "700",
      textAlign: "center",
    },
    "& td": {
      textAlign: "center",
    },
  },
}));

const excel_columns = [
  {
    label: "카테고리구분",
    value: "category_type",
    render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군"),
  },
  {
    label: "카테고리명 (상품 수)",
    value: "category_name",
    render: (props) =>
      props.category_type === "N"
        ? `${props.depth1name} > ${props.depth2name} > ${props.depth3name}  (${props.product_count})`
        : `${props.category_name} (${props.product_count})`,
  },
];

export const CategoryList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { query, updateQuery, getDataFunction, SearchBox } = useQuery(location);

  const [categoryList, setCategoryList] = useState();
  const [selectedCategorys, setSelectedCategorys] = useState([]);
  const [isModify, setIsModify] = useState(false);

  const category_list_columns = [
    {
      title: "로고",
      render: ({ category_logo }) => (
        <ImageBox src={getFullImgURL(category_logo)} display="inline-block" width="60px" height="60px" />
      ),
      width: 180,
    },
    { title: "카테고리구분", render: ({ category_type }) => (category_type === "B" ? "브랜드" : "제품군"), width: 120 },
    {
      title: "카테고리명 (상품 수)",
      render: (props) =>
        props.category_type === "N"
          ? `${props.depth1name} > ${props.depth2name} > ${props.depth3name}  (${props.product_count})`
          : `${props.category_name} (${props.product_count})`,
      cellStyle: { textAlign: "N" === (query.category_type || "N") && "left" },
    },
    // { field: "exposure_priority", title: "노출순위" },
  ];

  async function getCategoryList(query) {
    let data = await apiObject.getCategoryList({ ...query });
    setCategoryList(data);
  }
  async function removeCategories() {
    if (!window.confirm("선택한 카테고리들을 삭제하시겠습니까?")) return;

    let category_array = [];
    selectedCategorys.forEach((item) => {
      category_array.push({
        category_pk: item.category_pk,
      });
    });

    await apiObject.removeCategories({ category_array });
    getCategoryList();
  }
  async function modifyExposureSequence(data) {
    if (!window.confirm("카테고리 노출순서를 수정하시겠습니까?")) return;

    let category_array = [];
    data.forEach((item, index) => {
      category_array.push({
        category_pk: item.category_pk,
        category_seq: index + 1,
      });
    });

    await apiObject.modifyCategorySequence({ category_type: query.category_type || "B", category_array });
    getCategoryList();
    setIsModify(false);
  }

  useEffect(() => {
    getDataFunction(getCategoryList);
  }, []);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography variant="h5" fontWeight="500">
          상품 카테고리
        </Typography>

        <Button ml={2} color="primary" onClick={() => history.push("/product/item")}>
          상품 목록 관리
        </Button>
      </Box>

      {!isModify && (
        <Box className={classes.header}>
          <Box>
            <Select
              displayEmpty
              name="category_type"
              margin="dense"
              value={query.category_type || "B"}
              onChange={(e) => updateQuery({ category_type: e.target.value })}
              startAdornment={
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              }
            >
              <MenuItem value={"B"}>브랜드</MenuItem>
              <MenuItem value={"N"}>제품군</MenuItem>
            </Select>
          </Box>

          <Box>
            <Button onClick={() => setIsModify(true)}>노출순서 수정</Button>
            <Button color="primary" ml={2} onClick={() => history.push("/product/category/add")}>
              등록
            </Button>
            <Button color="secondary" ml={2} onClick={removeCategories} disabled={!selectedCategorys?.length}>
              삭제
            </Button>
          </Box>
        </Box>
      )}

      <Box mt={2} mb={3}>
        {isModify ? (
          <DnDList
            data={
              (query.category_type || "B") === "B" ? categoryList?.categoryBrandList : categoryList?.categoryNormalList
            }
            columns={category_list_columns}
            className={classes.dnd_container}
            onModifyFinish={modifyExposureSequence}
            onCancel={() => setIsModify(false)}
          />
        ) : (
          <ColumnTable
            columns={category_list_columns}
            data={
              (query.category_type || "B") === "B" ? categoryList?.categoryBrandList : categoryList?.categoryNormalList
            }
            onRowClick={(row) =>
              history.push({
                pathname: `/product/category/${row.category_pk}`,
                state: {
                  category_type: query?.category_type || "B",
                },
              })
            }
            selection
            onSelectionChange={setSelectedCategorys}
          />
        )}
      </Box>

      {!isModify && (
        <Grid container className={classes.table_footer}>
          <ExcelExportButton
            data={
              (query.category_type || "B") === "B" ? categoryList?.categoryBrandList : categoryList?.categoryNormalList
            }
            columns={excel_columns}
            path="Category"
          />

          <Box className={classes.search_section}>
            <Box display="inline-block" mx={1} />

            <SearchBox />
          </Box>
        </Grid>
      )}
    </Box>
  );
};
