import React from "react";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import Search from "@material-ui/icons/Search";

const SearchTextComponent = () => (
  <TextField
    id="narrowdown-search"
    label="Narrow down maps"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Search />
        </InputAdornment>
      ),
    }}
  />
);

export default SearchTextComponent;
