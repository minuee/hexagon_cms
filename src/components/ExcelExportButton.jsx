import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "hooks";
import { apiObject } from "api";

import { DescriptionOutlined } from "@material-ui/icons";
import { Button } from "components/materialui";

export const ExcelExportButton = ({ path, params, ...props }) => {
  const location = useLocation();
  const { query } = useQuery(location);

  async function exportExcel() {
    let url = await apiObject.getExcelLink({ path, query, params });

    if (url) {
      window.open(url);
    }
  }

  return (
    <Button p={1} onClick={exportExcel} {...props}>
      <DescriptionOutlined />
      엑셀저장
    </Button>
  );
};
