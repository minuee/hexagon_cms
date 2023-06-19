import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { apiObject } from "api";
import { price } from "common";
import { useQuery } from "hooks";
import dayjs from "dayjs";

import { Grid, Box, makeStyles } from "@material-ui/core";
import { Typography, Button } from "components/materialui";
import { ColumnTable } from "components";

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
    height: theme.spacing(5),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",

    "& >:first-child, >:last-child": {
      background: "#fff",
    },
  },
}));

const point_list_columns = [
  { title: "번호", field: "no", width: 100 },
  { title: "사용자", field: "member_name" },
  { title: "금액", render: ({ reward_point }) => price(reward_point), width: 160, cellStyle: { textAlign: "right" } },
  {
    title: "발생일자",
    render: ({ reg_date }) => dayjs.unix(reg_date).format("YYYY-MM-DD"),
    width: 160,
  },
  {
    title: "구분",
    render: ({ special_code }) => special_code ? '회원초대' : '수동지급',
    width: 160,
  },
  // { title: "사용여부", render: ({ use_yn }) => (use_yn ? "Y" : "N"), width: 120 },
];

export const PointList = ({ location }) => {
  const classes = useStyles();
  const history = useHistory();
  const { getDataFunction, Pagination, FilterBox } = useQuery(location);

  const [pointList, setPointList] = useState();

  async function getPointList(query) {
    let data;
    data = await apiObject.getPointList({ ...query });
    setPointList(data);
  }

  useEffect(() => {
    getDataFunction(getPointList);
  }, []);

  return (
    <Box>
      <Grid container justify="space-between" alignItems="center">
        <Typography display="inline" variant="h5" fontWeight="500">
          포인트 지급 목록
        </Typography>

        <Box className={classes.header_buttons}>
           <Button color="primary" ml={3} onClick={() => history.push(`/point/regist`)}>
            등록
          </Button>
        </Box>
      </Grid>

      <Box mt={2} mb={3}>
        <ColumnTable
          columns={point_list_columns}
          data={pointList}
          onRowClick={(row) => history.push(`/point/${row.pointlog_pk}`)}
        />
      </Box>

      <Grid container className={classes.table_footer}>
        <Pagination total={pointList?.[0]?.total} />
      </Grid>
    </Box>
  );
};
