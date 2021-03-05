import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

const generateEmptyQuestions = (flatQuestionnaire) => {
  const tempEmptyQuestions = [];
  Object.keys(flatQuestionnaire).forEach((k) => {
    if (flatQuestionnaire[k].required) {
      const mappedToHeader = !!(flatQuestionnaire[k].header || "").length;
      const mappedToConstant = !!(
        (flatQuestionnaire[k].constant || {}).code || ""
      ).length;
      if (!mappedToHeader && !mappedToConstant) {
        tempEmptyQuestions.push(flatQuestionnaire[k].text);
      }
    }
  });
  return tempEmptyQuestions;
};

const SendButtonTooltip = (props) => {
  const { flatQuestionnaire, mapUnchanged, tempDelay, unmappedHeaders } = props;
  const tempEmptyQuestions = generateEmptyQuestions(flatQuestionnaire);

  return ((mapUnchanged && tempDelay) ? <Typography>Submission in progress</Typography> : (
      <div>
        <Typography>Cannot Upload</Typography>
        <br />
        {mapUnchanged && (
          <div>
            <span>Map is the same as last submission</span>
            <br />
            <br />
          </div>
        )}
        {!mapUnchanged && tempDelay && (
          <div>
            <span>Please wait a few seconds for button to be reenabled</span>
            <br />
            <br />
          </div>
        )}
        {Object.keys(unmappedHeaders).length !== 0 && (
          <div>
            <strong>Unmapped Headers</strong>
            <br />
            <span>{Object.keys(unmappedHeaders).join(", ")}</span>
            <br />
            <br />
          </div>
        )}
        {tempEmptyQuestions.length !== 0 && (
          <div>
            <strong>Unmapped Questions</strong>
            <br />
            <span>{tempEmptyQuestions.join(", ")}</span>
            <br />
            <br />
          </div>
        )}
      </div>
    )
  );
};

SendButtonTooltip.propTypes = {
  flatQuestionnaire: PropTypes.objectOf(PropTypes.object).isRequired,
  mapUnchanged: PropTypes.bool.isRequired,
  tempDelay: PropTypes.bool.isRequired,
  unmappedHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default SendButtonTooltip;
