import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import Search from "@material-ui/icons/Search";

function SearchTextComponent(props) {
  return (
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
}

export default SearchTextComponent;
