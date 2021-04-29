import React from "react";
import PropTypes from "prop-types";

import { Card, Typography } from "@material-ui/core";

import { stylesObj } from "../styling/stylesObj";

function formatErrors(errors) {
  return Object.keys(errors).map((key) => (
    <div>
      <Typography variant="h6" style={stylesObj.validationErrorProp}>
        {key}
      </Typography>
      {errors[key].invalidValueMapping && (
        <Typography variant="body1" style={stylesObj.validationErrorText}>
          Values are not Mapped for following values:
          {Object.keys(errors[key].invalidValueMapping).join(", ")}
        </Typography>
      )}
      {errors[key].invalidValueType && (
        <Typography variant="body1" style={stylesObj.validationErrorText}>
          Values are Invalid on the following rows:
          {errors[key].invalidValueType.join(", ")}
        </Typography>
      )}
      {errors[key].invalidLogicPath && (
        <Typography variant="body1" style={stylesObj.validationErrorText}>
          Specified logic did not return any values
        </Typography>
      )}
    </div>
  ));
}

function ValidationCard(props) {
  const {
    data,
    errors,
    invalidHeaders,
    missingHeaders,
    success,
    urlResponse,
  } = props;
  const cardStyling = success
    ? stylesObj.validationSuccessCard
    : stylesObj.validationErrorCard;

  let successText;
  if (success) {
    successText = "Success!";
  } else if (Object.keys(errors).length > 0) {
    successText = "Invalid File: Value Errors";
  } else {
    successText = "Invalid File: Header Errors";
  }

  return (
    <div>
      {invalidHeaders.length > 0 && (
        <Card height="100%" style={stylesObj.validationWarningCard}>
          <div style={stylesObj.themePadding}>
            <Typography variant="h6">
              <strong>Warning: Extra Headers in CSV File</strong>
            </Typography>
            {invalidHeaders.length > 0 && (
              <Typography variant="body1">
                Headers in csv file, not in map:
                {invalidHeaders.join(", ")}
              </Typography>
            )}
          </div>
        </Card>
      )}
      <Card height="100%" style={cardStyling}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6">
            <strong>{successText}</strong>
          </Typography>
          {data.resourceType === "Bundle" &&
            Object.keys(urlResponse).length === 0 && (
              <Typography variant="body1">
                Questionnaire Responses Bundle:
                {JSON.stringify(data)}
              </Typography>
            )}
          {data.resourceType === "Bundle" &&
            Object.keys(urlResponse).length > 0 && (
              <Typography variant="body1">
                Response from URL:
                {JSON.stringify(urlResponse)}
              </Typography>
            )}
          {missingHeaders.length > 0 && (
            <Typography variant="body1">
              Headers in map, missing from csv file:
              {missingHeaders.join(", ")}
            </Typography>
          )}
          {Object.keys(errors).length > 0 && <div>{formatErrors(errors)}</div>}
        </div>
      </Card>
    </div>
  );
}

export default ValidationCard;

ValidationCard.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  errors: PropTypes.objectOf(PropTypes.object).isRequired,
  invalidHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
  missingHeaders: PropTypes.arrayOf(PropTypes.string).isRequired,
  success: PropTypes.bool.isRequired,
  urlResponse: PropTypes.objectOf(PropTypes.object).isRequired,
};
