import React from "react";
import { Box, Select, MenuItem } from "@material-ui/core";

export const FilterBox2 = ({
  search_params,
  filter_item = "filter_item",
  item_list = [],
  default_item = "",
  onFilter,
  ...props
}) => {
  return (
    <Box display="inline-block" {...props}>
      <Select
        displayEmpty
        margin="dense"
        style={{ background: "#fff" }}
        value={search_params[filter_item] || default_item}
        onChange={(e) => onFilter({ [filter_item]: e.target.value })}
      >
        {item_list.map((item, index) => (
          <MenuItem value={item.value} key={index}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
