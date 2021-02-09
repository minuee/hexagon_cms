import React from "react";
import { Box } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";

const MyPagination = ({ page = 1, setPage = () => {}, name = "page", count }) => {
  return (
    <Box position="absolute" display="flex" justifyContent="center" alignItems="center" width="100%" height="0px">
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
