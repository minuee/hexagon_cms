import React, { useState } from "react";

import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";

export const SearchBox = ({ defaultValue = "", placeholder, onSearch, className }) => {
  const [searchWord, setSearchWord] = useState(defaultValue);

  return (
    <TextField
      className={className}
      value={searchWord}
      placeholder={placeholder}
      onChange={(e) => setSearchWord(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === "Enter" && searchWord !== defaultValue) {
          onSearch({ search_word: searchWord });
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton
              onClick={() => {
                if (searchWord !== defaultValue) {
                  onSearch({ search_word: searchWord });
                }
              }}
            >
              <Search />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};
