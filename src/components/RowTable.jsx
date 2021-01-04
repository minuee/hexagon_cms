import React from "react";
import { makeStyles, Box, Table, TableBody, TableRow, TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table_wrapper: {
    width: "100%",
    background: "#fff",
    fontFamily: theme.typography.fontFamily,

    "& td:first-child": {
      background: theme.palette.grey[300],
      width: "14rem",
    },
  },
}));

export const RowTable = ({ width, children }) => {
  const classes = useStyles();
  return (
    <Box width={width}>
      <Table className={classes.table_wrapper}>
        <TableBody>{children}</TableBody>
      </Table>
    </Box>
  );
};
