import React from "react";
import { Box } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

const MyPagination = ({ page, setPage = () => {}, name = "page", count = 10 }) => {
  return (
    <Box position="absolute" display="flex" justifyContent="center" alignItems="center" width="100%" height="0px">
      <Pagination color="primary" count={count} page={page} onChange={(e, v) => setPage(name, v)} shape="rounded" />
    </Box>
  );
};
export { MyPagination as Pagination };
