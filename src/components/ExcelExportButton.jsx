// import React, { useState, useEffect } from "react";
// import ReactExport from "react-data-export";

// import { Box } from "@material-ui/core";
// import { DescriptionOutlined } from "@material-ui/icons";
// import { Button } from "components/materialui";

// const ExcelFile = ReactExport.ExcelFile;
// const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
// const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "hooks";
import { apiObject } from "api";
import XLSX from "xlsx";

import { DescriptionOutlined } from "@material-ui/icons";
import { Button } from "components/materialui";

const api_lookuptable = {
  Member: apiObject.getMemberList,
  Order: apiObject.getOrderList,
  Category: apiObject.getCategoryList,
  Product: apiObject.getProductList,
  Salesman: apiObject.getSalesmanList,
  Member_Order: apiObject.getOrderList,
};

export const ExcelExportButton = ({ data, columns, path, params, ...props }) => {
  const location = useLocation();
  const { query } = useQuery(location);

  async function exportExcel() {
    let data = await api_lookuptable[path]({ ...query, ...params, is_excel: true });
    if (path === "Category") {
      data = [...data.categoryBrandList, ...data.categoryNormalList];
    }

    let manipulated_data = data.map((r) => {
      let tmp = {};
      columns.forEach((c) => {
        if (c.render) {
          tmp[c.value] = c.render(r);
        } else {
          tmp[c.value] = r[c.value];
        }
      });

      return tmp;
    });

    const ws = XLSX.utils.json_to_sheet(manipulated_data, {
      header: columns.map((col) => {
        return col.value;
      }),
    });

    columns.forEach((col, index) => {
      let addr = XLSX.utils.encode_col(index) + "1";
      ws[addr].v = col.label;
    });

    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, ws, "");
    XLSX.writeFile(workBook, `Hexagon_${path}.xlsx`);
  }

  return (
    <Button p={1} onClick={exportExcel} {...props}>
      <DescriptionOutlined />
      엑셀저장
    </Button>
  );
};

// export const ExcelExportButton = ({ data, columns, path, ...props }) => {
//   const [exportData, setExportData] = useState();

//   useEffect(() => {
//     function manipulateData() {
//       if (!data || !columns) return;

//       let data_arr = [];

//       data.forEach((item) => {
//         let tmp = { ...item };
//         columns?.forEach((col) => {
//           if (col.render) {
//             tmp[col.value] = col.render(item);
//           }
//         });
//         data_arr.push(tmp);
//       });
//       setExportData(data_arr);
//     }
//     manipulateData();
//   }, [data, columns]);

//   return (
//     <Box {...props}>
//       <ExcelFile
//         element={
//           <Button p={1}>
//             <DescriptionOutlined />
//             엑셀저장
//           </Button>
//         }
//         filename={`Hexagon_${path}`}
//       >
//         <ExcelSheet data={exportData} name={`hexagon_${path}_data`}>
//           {columns?.map((item, index) => (
//             <ExcelColumn label={item.label} value={item.value} key={index} />
//           ))}
//         </ExcelSheet>
//       </ExcelFile>
//     </Box>
//   );
// };
