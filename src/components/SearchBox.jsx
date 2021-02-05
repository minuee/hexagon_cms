import React, { useState } from "react";

import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

export const SearchBox = ({ defaultValue, onSearch, className }) => {
  const [searchWord, setSearchWord] = useState(defaultValue || "");

  return (
    <TextField
      className={className}
      value={searchWord}
      onChange={(e) => setSearchWord(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && onSearch("search_word", searchWord)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton onClick={() => onSearch("search_word", searchWord)}>
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
