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

import { stylesObj } from "../styling/stylesObj";

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
            <div style={{display:'flex'}}>
              <span>Where</span>
              <Select
                id="select_key"
                autoWidth
                value={logicKey}
                onChange={(el) => setLogicKey(el.target.value)}
              >
                {extractKeys(node.items).map(k => <MenuItem value={k}>{k}</MenuItem>)}
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
