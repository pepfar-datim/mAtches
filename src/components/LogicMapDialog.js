import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,  
  FormControl,
  MenuItem,  
  Select,
  TextField,  
  Typography,
} from "@material-ui/core/";

import { stylesObj } from "../styling/stylesObj";
import classes from "../styling/LogicMapDialog.module.css";


const extractKeys = items => {
  let keys = {};
  items.forEach(item => {
    item.items.forEach(innerItem => {
      keys[innerItem.key] = '';
    })
  })
  return Object.keys(keys)
}

const LogicMapDialog = ({ handleClose, node }) => {

  const [logicKey, setLogicKey] = useState('')
  const [logicOperation, setLogicOperation] = useState('')
  const [selectKey, setSelectKey] = useState('')

  const availableLogicalOperations = ['equals', 'is greater than', 'is less than']

  return (
    <div>
      <Dialog
        open={true}
      >
        <DialogTitle id="form-dialog-title">
          <span>Define <strong>{node.key}</strong> structure with logic</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
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
                {extractKeys(node.items).map(k => <MenuItem autoWidth value={k}>{k}</MenuItem>)}
              </Select>
            </div>
            <div className={classes.logicSelectorContainer}>
              <Select
                id="select_logical_operator"
                className={classes.logicSelectorSelect}
                value={logicOperation}                
                onChange={(el) => setLogicOperation(el.target.value)}
              >
                {availableLogicalOperations.map(k => <MenuItem autoWidth value={k}>{k}</MenuItem>)}
              </Select>
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
                {extractKeys(node.items).map(k => <MenuItem autoWidth value={k}>{k}</MenuItem>)}
              </Select>
            </div>            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            color="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

LogicMapDialog.propTypes = {
  node: PropTypes.object,
  handleClose: PropTypes.func,
};

export default LogicMapDialog
