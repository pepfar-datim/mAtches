import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core/";

import { stylesObj } from "../styling/stylesObj";
import classes from "../styling/LogicMapDialog.module.css";

// should be move/rethought
const generateUid = () => {
  const CHARACTERS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const UID_LENGTH = 6;
  let uid = CHARACTERS[Math.trunc(Math.random() * (CHARACTERS.length - 11))];

  for (let i = 1; i < UID_LENGTH; i +=1 ) {
    uid += CHARACTERS[Math.trunc(Math.random() * (CHARACTERS.length - 1))];
  }
  return uid;
};

const getFHIRPath = (logicCondition, logicKey, operator, selectKey) =>
  `where(${logicKey}.${operator}'${logicCondition}').${selectKey}`;

const extractKeys = (items) => {
  const keys = {};
  items.forEach((item) => {
    item.items.forEach((innerItem) => {
      keys[innerItem.key] = "";
    });
  });
  return Object.keys(keys);
};

const LogicMapDialog = ({ handleClose, handleSave, node }) => {
  const [logicKey, setLogicKey] = useState("");
  const [logicOperation, setLogicOperation] = useState("");
  const [logicCondition, setlogicCondition] = useState("");
  const [selectKey, setSelectKey] = useState("");
  const [alias, setAlias] = useState("");

  const availableLogicalOperations = [
    { id: "eq", text: "equals", operator: "==" },
    { id: "gt", text: "is greater than", operator: ">" },
    { id: "lt", text: "is less than", operator: "<" },
  ];

  const checkForInputError = (logicCond, logicOp) => {
    if (logicCond === "" || logicOp === "") {
      return false;
    }
    if (logicCond === "lt" || logicOp === "gt") {
      return Number.isNaN(Number(logicCond));
    }
    return false;
  };

  const commitChanges = () => {
    handleSave({
      operator: logicOperation,
      logicKey,
      logicCondition,
      selectKey,
      alias:
        alias !== ""
          ? alias
          : getFHIRPath(logicCondition, logicKey, logicOperation, selectKey),
      fhirPath: getFHIRPath(
        logicCondition,
        logicKey,
        logicOperation,
        selectKey
      ),
      itemPath: node.itemPath,
      id: generateUid(),
    });
  };

  const isSaveDisabled = () => {
    if (
      logicOperation !== "" &&
      logicCondition !== "" &&
      logicKey !== "" &&
      selectKey !== ""
    ) {
      return checkForInputError(logicCondition, logicOperation);
    }
    return true;
  };

  return (
    <div>
      <Dialog open>
        <DialogTitle id="form-dialog-title">
          <span>Define <strong>{node.key}</strong> structure with logic</span>
        </DialogTitle>
        <DialogContent className={classes.logicDialogContent}>
          <div className={classes.logicSelectorContainer}>
            <div className={classes.logicSelectorText}>
              <Typography>Where</Typography>
            </div>
            <Select
              id="select_key"
              className={classes.logicSelectorSelect}
              value={logicKey}
              onChange={(el) => setLogicKey(el.target.value)}
            >
              {extractKeys(node.items).map((k) => (
                <MenuItem value={k}>{k}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.logicSelectorContainer}>
            <Select
              id="select_logical_operator"
              className={classes.logicSelectorSelect}
              value={logicOperation}
              onChange={(el) => setLogicOperation(el.target.value)}
            >
              {availableLogicalOperations.map((op) => (
                <MenuItem value={op.id}>{op.text}</MenuItem>
              ))}
            </Select>
            <div className={classes.logicSelectorInput}>
              <TextField
                id="logic_condition_text_field"
                className={classes.logicSelectorInput}
                error={checkForInputError(logicCondition, logicOperation)}
                helperText={
                  checkForInputError(logicCondition, logicOperation)
                    ? "Number required"
                    : null
                }
                value={logicCondition}
                onChange={(el) => setlogicCondition(el.target.value)}
              />
            </div>
          </div>
          <div className={classes.logicSelectorContainer}>
            <div className={classes.logicSelectorText}>
              <Typography>select </Typography>
            </div>
            <Select
              id="select_key"
              className={classes.logicSelectorSelect}
              value={selectKey}
              onChange={(el) => setSelectKey(el.target.value)}
            >
              {extractKeys(node.items).map((k) => (
                <MenuItem value={k}>{k}</MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.logicSelectorSubheader}>
            <Typography>
              Only the first value that satisfies your logic will be used.
            </Typography>
          </div>
          <div className={classes.aliasSubheader}>
            <Typography>
              You can optionally provide an alias to identify this logic
            </Typography>
          </div>
          <div className={classes.logicSelectorContainer}>
            <div className={classes.logicSelectorText}>
              <Typography>alias: </Typography>
            </div>
            <TextField
              id="alias_text_field"
              className={classes.aliasInput}
              value={alias}
              onChange={(el) => setAlias(el.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={stylesObj.logicCancelButton}>
            Cancel
          </Button>
          <Button
            disabled={isSaveDisabled()}
            onClick={commitChanges}
            style={
              isSaveDisabled()
                ? stylesObj.logicSaveButtonDisabled
                : stylesObj.logicSaveButton
            }
          >
            Save logic
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

LogicMapDialog.propTypes = {
  node: PropTypes.objectOf(PropTypes.object).isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export default LogicMapDialog;
