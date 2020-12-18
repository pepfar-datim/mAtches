import React from "react";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@material-ui/core";

import { stylesObj } from "./styling/stylesObj.js";

import config from "../config.json";

function RequiredNonRequiredSelector(props) {
  return (
    <div>
      <RadioGroup
        style={stylesObj.uploadDestinationRadioGroup}
        aria-label="visibility"
        name="visibilitySelector"
        value={props.itemVisibility}
        onChange={(e) => props.handleVisibilityChange(e.target.value)}
        row
      >
        <FormControlLabel
          value="all"
          control={<Radio style={stylesObj.uploadDestinationRadio} />}
          label="Show all items"
        />
        <FormControlLabel
          value="required"
          control={<Radio style={stylesObj.uploadDestinationRadio} />}
          label="Show only required items"
        />
      </RadioGroup>
    </div>
  );
}

export default RequiredNonRequiredSelector;
