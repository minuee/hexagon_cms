import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "absolute",
    left: 0,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: "100%",
    height: "0px",
  },
}));

const MyPagination = ({ page = 1, setPage = () => {}, name = "page", count }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Pagination
        color="primary"
        count={count}
        page={parseInt(page)}
        onChange={(e, v) => setPage(name, v)}
        shape="rounded"
      />
    </Box>
  );
};
export { MyPagination as Pagination };
