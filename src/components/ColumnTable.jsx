import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import MaterialTable from "material-table";

const useStyles = makeStyles((theme) => ({
  table_wrapper: {
    "& *": {
      textAlign: "center",
    },
    "& tr": {
      fontFamily: theme.typography.fontFamily,
    },
    "& th": {
      background: theme.palette.grey[300],
      fontWeight: "700",
    },
  },
}));

export const ColumnTable = ({ columns, data = [], onRowClick, selection, options, ...props }) => {
  const classes = useStyles();
  return (
    <Box className={classes.table_wrapper}>
      <MaterialTable
        data={data}
        columns={columns}
        onRowClick={onRowClick ? (e, row) => onRowClick(row) : undefined}
        localization={{
          body: {
            emptyDataSourceMessage: "검색 조건에 부합하는 데이터를 찾을 수 없습니다",
          },
        }}
        options={{
          toolbar: false,
          search: false,
          draggable: false,
          sorting: false,
          paging: false,

          selection: !!selection || false,
          showSelectAllCheckbox: false,

          ...options,
        }}
        components={{
          Container: (props) => <Box bgcolor="#fff" {...props} />,
        }}
        {...props}
      />
    </Box>
  );
};
