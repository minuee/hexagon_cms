import React from "react";

import { Box, makeStyles } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { Typography, Button } from "components/materialui";

const useStyles = makeStyles((theme) => ({
  filter_box: {
    display: "inline-block",

    "& > *": {
      marginleft: theme.spacing(1),
    },
  },
}));

export const FilterBox = ({ type, button_list = [], default_item, query, onQueryUpdate, ...props }) => {
  const classes = useStyles();

  function handleSort(value) {
    let update = {
      [`${type}_item`]: value,
    };

    if (type === "sort") {
      if (value == (query.sort_item || default_item)) {
        update.sort_type = query?.sort_type === "ASC" ? "DESC" : "ASC";
      } else {
        update.sort_type = "DESC";
      }
    } else {
      if (update[`${type}_item`] == (query[`${type}_item`] || default_item)) {
        return;
      }
    }

    onQueryUpdate(update);
  }

  return (
    <Box className={classes.filter_box} {...props}>
      {button_list.map((item, index) => {
        let is_cur = item.value === (query[`${type}_item`] || default_item);

        return (
          <Button variant="text" onClick={() => handleSort(item.value)} key={index}>
            <Typography fontWeight={is_cur ? "700" : undefined}>{item.label}</Typography>
            {type === "sort" && is_cur && <>{query?.sort_type === "ASC" ? <ArrowDropUp /> : <ArrowDropDown />}</>}
          </Button>
        );
      })}
    </Box>
  );
};
