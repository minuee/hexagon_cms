import React from "react";
import { makeStyles, Box } from "@material-ui/core";
import { Pagination as MuiPagination } from "@material-ui/lab";

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

const Pagination = ({ page = 1, setPage = () => {}, total }) => {
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <MuiPagination
        color="primary"
        count={Math.ceil(+total / 10)}
        page={parseInt(page)}
        onChange={(e, v) => {
          if (v !== page) {
            setPage({ page: v });
          }
        }}
        shape="rounded"
      />
    </Box>
  );
};
export { Pagination };
