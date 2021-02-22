import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

import { makeStyles, Box, InputAdornment } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { EventNote } from "@material-ui/icons";
import { Button } from "components/materialui";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "inline-flex",
    alignItems: "center",

    "& > .MuiFormControl-root": {
      background: "#fff",
      width: "10rem",
    },
  },
}));

export const TermSearchBox = ({ term_start, term_end, onTermSearch }) => {
  const classes = useStyles();

  const [startTerm, setStartTerm] = useState(null);
  const [endTerm, setEndTerm] = useState(null);

  useEffect(() => {
    if (term_start) setStartTerm(dayjs.unix(term_start));
  }, [term_start]);
  useEffect(() => {
    if (term_end) setEndTerm(dayjs.unix(term_end));
  }, [term_end]);

  return (
    <Box className={classes.container}>
      <DatePicker
        value={startTerm}
        onChange={(d) => setStartTerm(d.startOf("day"))}
        format="YYYY-MM-DD"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EventNote />
            </InputAdornment>
          ),
        }}
      />
      <Box mx={1} fontWeight="700">
        -
      </Box>
      <DatePicker
        value={endTerm}
        onChange={(d) => setEndTerm(d.endOf("day"))}
        format="YYYY-MM-DD"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <EventNote />
            </InputAdornment>
          ),
        }}
      />

      <Button
        ml={1}
        color="primary"
        onClick={() =>
          onTermSearch("term", {
            term_start: startTerm?.unix(),
            term_end: endTerm?.unix(),
          })
        }
      >
        검색
      </Button>
    </Box>
  );
};
