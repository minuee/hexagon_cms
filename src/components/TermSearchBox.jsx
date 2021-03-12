import React, { useState } from "react";
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

  const [termStart, setTermStart] = useState(term_start ? dayjs.unix(term_start) : null);
  const [termEnd, setTermEnd] = useState(term_end ? dayjs.unix(term_end) : null);

  function handleTermSearch() {
    if (term_start !== termStart?.unix() || term_end !== termEnd?.unix())
      onTermSearch({
        term_start: termStart?.unix(),
        term_end: termEnd?.unix(),
      });
  }

  return (
    <Box className={classes.container}>
      <DatePicker
        value={termStart}
        maxDate={termEnd || dayjs.unix(9999999999)}
        onChange={(d) => setTermStart(d.startOf("day"))}
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
        value={termEnd}
        minDate={termStart || dayjs.unix(0)}
        onChange={(d) => setTermEnd(d.endOf("day"))}
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

      <Button ml={1} color="primary" onClick={handleTermSearch}>
        검색
      </Button>
      <Button
        ml={1}
        onClick={() => {
          setTermStart(null);
          setTermEnd(null);
        }}
      >
        초기화
      </Button>
    </Box>
  );
};
