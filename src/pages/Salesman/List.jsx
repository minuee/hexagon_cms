import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { price } from "common";
import dayjs from "dayjs";

import { Grid, Box, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import { DescriptionOutlined, Search } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";
import { ColumnTable, Pagination } from "components";

const useStyles = makeStyles((theme) => ({
  header_buttons: {
    display: "inline-flex",
    alignItems: "center",

    "& > *": {
      marginleft: theme.spacing(1),
    },
  },
  table_footer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const salesman_list_columns = [
  { field: "salesman_name", title: "이름" },
  { field: "salesman_code", title: "코드값" },
  { field: "salesman_phone", title: "휴대폰번호" },
  {
    field: "salesman_total_amount",
    title: "구매대행액",
    render: ({ salesman_total_amount }) => `${price(salesman_total_amount)}원`,
    cellStyle: { textAlign: "right" },
  },
  {
    field: "salesman_total_incentive",
    title: "인센티브액",
    render: ({ salesman_total_incentive }) => `${price(salesman_total_incentive)}원`,
    cellStyle: { textAlign: "right" },
  },
  { field: "salesman_status_text", title: "상태" },
];
const salesman_list_rows = [
  {
    salesman_no: 1,
    salesman_name: "전지현",
    salesman_code: "81JK3D",
    salesman_phone: "01022223333",
    salesman_total_amount: 123456700,
    salesman_total_incentive: 123400,
    salesman_status_text: "정지",
  },
  {
    salesman_no: 2,
    salesman_name: "정우성",
    salesman_code: "81JK3D",
    salesman_phone: "01022223333",
    salesman_total_amount: 123456700,
    salesman_total_incentive: 123400,
    salesman_status_text: "정상",
  },
  {
    salesman_no: 3,
    salesman_name: "수지",
    salesman_code: "81JK3D",
    salesman_phone: "01022223333",
    salesman_total_amount: 123456700,
    salesman_total_incentive: 123400,
    salesman_status_text: "정상",
  },
  {
    salesman_no: 4,
    salesman_name: "김영찬",
    salesman_code: "81JK3D",
    salesman_phone: "01022223333",
    salesman_total_amount: 123456700,
    salesman_total_incentive: 123400,
    salesman_status_text: "정지",
  },
];

export const SalesmanList = () => {
  const classes = useStyles();
  const history = useHistory();

  const [salesmanList, setSalesmanList] = useState();
  const [listContext, setListContext] = useState({
    page: 1,
    search_text: "",
  });

  function handleContextChange(name, value) {
    setListContext({
      ...listContext,
      [name]: value,
    });
  }

  useEffect(() => {
    console.log("listContext", listContext);
  }, [listContext]);

  useEffect(() => {
    setSalesmanList(salesman_list_rows);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          영업사원목록
        </Typography>

        <Box className={classes.header_buttons}>
          <Button>이름순</Button>
          <Button>구매대행액순</Button>
          <Button>인센티브액순</Button>
          <Button ml={2} variant="contained" onClick={() => history.push("/salesman/add")}>
            영업사원등록
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={salesman_list_columns}
          data={salesmanList}
          onRowClick={(row) => history.push(`/salesman/${row.salesman_no}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Button variant="contained" p={1}>
          <DescriptionOutlined />
          엑셀저장
        </Button>

        <Pagination page={listContext.page} setPage={handleContextChange} />

        <TextField
          name="search_text"
          variant="outlined"
          value={listContext.search_text}
          onChange={(e) => handleContextChange("search_text", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Box>
  );
};
