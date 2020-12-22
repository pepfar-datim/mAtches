import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core/";

import { stylesObj } from "./styling/stylesObj";

export default function ConstantDialog(props) {
  const {
    constantHeader,
    closeConstantMapDialog,
    open,
    path,
    qID,
    setConstant,
    valueArray,
    valueType,
  } = props;
  const [constantText, setConstantText] = useState("");
  const [constantCode, setConstantCode] = useState("");
  const choiceValue = !!valueArray.length;
  let choiceCodeMap = {};
  if (choiceValue) {
    choiceCodeMap = valueArray.reduce(
      (tempChoiceCodeMap, currentValue) =>
        Object.assign(tempChoiceCodeMap, {
          [currentValue.code]: currentValue.display,
        }),
      {}
    );
  }
  return (
    <div>
      <Dialog
        open={open}
        onClose={closeConstantMapDialog}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          map&nbsp;
          <strong>{constantHeader}</strong>
          &nbsp;to constant
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {choiceValue ? "Select " : "Enter "}
            your constant value.
          </DialogContentText>
          {choiceValue !== true && (
            <TextField
              autoFocus
              margin="dense"
              id="constant_entry"
              type="constant"
              value={constantCode}
              onChange={(e) => {
                setConstantText(e.target.value);
                setConstantCode(e.target.value);
              }}
              fullWidth
            />
          )}
          {choiceValue === true && (
            <FormControl style={stylesObj.themeWidth}>
              <InputLabel shrink htmlFor="questionnaire-select">
                Select Value
              </InputLabel>
              <Select
                value={constantCode}
                displayEmpty
                name="questionnaire"
                onChange={(e) => {
                  setConstantText(choiceCodeMap[e.target.value]);
                  setConstantCode(e.target.value);
                }}
              >
                {valueArray.map((i) => (
                  <MenuItem key={`${i.code}_ConstantMap`} value={i.code}>
                    {i.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConstantMapDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConstant(qID, "add", {
                display: constantText,
                code: constantCode,
                valueType,
                path,
              });
              closeConstantMapDialog();
            }}
            color="primary"
            disabled={!constantText.length}
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ConstantDialog.propTypes = {
  constantHeader: PropTypes.string.isRequired,
  closeConstantMapDialog: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  path: PropTypes.arrayOf(PropTypes.string).isRequired,
  setConstant: PropTypes.func.isRequired,
  qID: PropTypes.string.isRequired,
  valueArray: PropTypes.arrayOf(PropTypes.string).isRequired,
  valueType: PropTypes.string.isRequired,
};
