import React from "react";
import PropTypes from "prop-types";

import {
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
} from "@material-ui/core";

import { stylesObj } from "./styling/stylesObj";

import config from "../config.json";

function UploadDestinationSelector(props) {
  const { destination, externalURL, onDestinationChange, onURLChange } = props;

  return (
    <div>
      <RadioGroup
        style={stylesObj.uploadDestinationRadioGroup}
        aria-label="destination"
        name="destinationSelector"
        value={destination}
        onChange={(e) => onDestinationChange(e.target.value)}
        row
      >
        <FormControlLabel
          value="internal"
          control={<Radio style={stylesObj.uploadDestinationRadio} />}
          label={`Output generated FHIR bundle in ${config.appName}`}
        />
        <FormControlLabel
          value="external"
          control={<Radio style={stylesObj.uploadDestinationRadio} />}
          label="Send generated FHIR bundle to external URL"
        />
      </RadioGroup>
      {destination === "external" && (
        <div>
          <TextField
            style={stylesObj.uploadDestinationText}
            id="url-name"
            label="URL"
            value={externalURL}
            onChange={(e) => onURLChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default UploadDestinationSelector;

UploadDestinationSelector.propTypes = {
  destination: PropTypes.string.isRequired,
  externalURL: PropTypes.string.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
  onURLChange: PropTypes.func.isRequired,
};
