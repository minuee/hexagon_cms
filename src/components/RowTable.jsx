import React from "react";
import { makeStyles, Box, Table, TableBody, TableRow, TableCell } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  table_wrapper: {
    width: "100%",
    background: "#fff",
    fontFamily: theme.typography.fontFamily,

    "& td:nth-last-child(even)": {
      background: theme.palette.grey[300],
      width: (props) => theme.spacing(props.headerWidth || 25),
    },
  },
}));

export const RowTable = ({ width, children, headerWidth }) => {
  const classes = useStyles({ headerWidth });
  return (
    <Box width={width}>
      <Table className={classes.table_wrapper}>
        <TableBody>{children}</TableBody>
      </Table>
    </Box>
  );
};
