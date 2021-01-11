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
    },
  },
}));

export const ColumnTable = ({ columns, data = [], onRowClick = () => {}, selection, ...props }) => {
  const classes = useStyles();
  return (
    <Box className={classes.table_wrapper}>
      <MaterialTable
        data={data}
        columns={columns}
        onRowClick={(e, row) => onRowClick(row)}
        options={{
          toolbar: false,
          search: false,
          draggable: false,
          sorting: false,

          paging: false,

          selection: !!selection || false,
        }}
        components={{
          Container: (props) => <Box bgcolor="#fff" {...props} />,
        }}
        {...props}
      />
    </Box>
  );
};
