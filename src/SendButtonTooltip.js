import React from "react";
import { Typography } from "@material-ui/core";

function generateEmptyQuestions(flatQuestionnaire) {
  let tempEmptyQuestions = [];
  Object.keys(flatQuestionnaire).map((k) => {
    if (flatQuestionnaire[k].required) {
      let mappedToHeader = !!(flatQuestionnaire[k].header || "").length;
      let mappedToConstant = !!(
        (flatQuestionnaire[k].constant || {}).code || ""
      ).length;
      if (!mappedToHeader && !mappedToConstant) {
        tempEmptyQuestions.push(flatQuestionnaire[k].text);
      }
    }
  }, tempEmptyQuestions);
  return tempEmptyQuestions;
}

function SendButtonTooltip(props) {
  let unmappedHeaders = props.unmappedHeaders;
  let tempEmptyQuestions = generateEmptyQuestions(props.flatQuestionnaire);

  return (
    <div>
      <Typography>Cannot Upload</Typography>
      <br />
      {props.mapUnchanged == true && (
        <div>
          <span>Map is the same as last submission</span>
          <br />
          <br />
        </div>
      )}
      {props.mapUnchanged == false && props.tempDelay == true && (
        <div>
          <span>Please wait a few seconds for button to be reenabled</span>
          <br />
          <br />
        </div>
      )}
      {Object.keys(unmappedHeaders).length != 0 && (
        <div>
          <strong>Unmapped Headers</strong>
          <br />
          <span>{Object.keys(unmappedHeaders).join(", ")}</span>
          <br />
          <br />
        </div>
      )}
      {tempEmptyQuestions.length != 0 && (
        <div>
          <strong>Unmapped Questions</strong>
          <br />
          <span>{tempEmptyQuestions.join(", ")}</span>
          <br />
          <br />
        </div>
      )}
    </div>
  );
}

export default SendButtonTooltip;
