import React, { useState, useEffect } from "react";
import ReactExport from "react-data-export";
import _ from "lodash";

import { Box } from "@material-ui/core";
import { DescriptionOutlined } from "@material-ui/icons";
import { Button } from "components/materialui";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

export const ExcelExportButton = ({ data, columns, path, ...props }) => {
  const [exportData, setExportData] = useState();

  useEffect(() => {
    function manipulateData() {
      if (!data || !columns) return;
      let manipulated = _.cloneDeep(data);

      manipulated?.forEach((item) => {
        columns?.forEach((col) => {
          if (col.render) {
            item[col.value] = col.render(item);
          }
        });
      });
      setExportData(manipulated);
    }
    manipulateData();
  }, [data, columns]);

  return (
    <Box {...props}>
      <ExcelFile
        element={
          <Button p={1}>
            <DescriptionOutlined />
            엑셀저장
          </Button>
        }
        filename={`Hexagon_${path}`}
      >
        <ExcelSheet data={exportData} name={`hexagon_${path}_data`}>
          {columns?.map((item, index) => (
            <ExcelColumn label={item.label} value={item.value} key={index} />
          ))}
        </ExcelSheet>
      </ExcelFile>
    </Box>
  );
};
