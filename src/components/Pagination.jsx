import React from "react";
import { Box } from "@material-ui/core";
import { Pagination, PaginationItem } from "@material-ui/lab";

const MyPagination = ({ page, setPage = () => {} }) => {
  return (
    <Box position="absolute" display="flex" justifyContent="center" alignItems="center" width="100%" height="0px">
      <Pagination
        color="primary"
        count={10}
        page={page}
        onChange={(e, v) => setPage("page", v)}
        shape="rounded"
        renderItem={(item) => <PaginationItem name="page" {...item} />}
      />
    </Box>
  );
};
export { MyPagination as Pagination };
