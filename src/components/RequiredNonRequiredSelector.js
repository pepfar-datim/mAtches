import React from "react";
import PropTypes from "prop-types";

import { Radio, RadioGroup, FormControlLabel } from "@material-ui/core";

import { stylesObj } from "../styling/stylesObj";

const RequiredNonRequiredSelector = (props) => {
  const { handleVisibilityChange, itemVisibility } = props;
  return (
    <div>
      <RadioGroup
        style={stylesObj.uploadDestinationRadioGroup}
        aria-label="visibility"
        name="visibilitySelector"
        value={itemVisibility}
        onChange={(e) => handleVisibilityChange(e.target.value)}
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
};

RequiredNonRequiredSelector.propTypes = {
  handleVisibilityChange: PropTypes.func.isRequired,
  itemVisibility: PropTypes.string.isRequired,
};

export default RequiredNonRequiredSelector;
