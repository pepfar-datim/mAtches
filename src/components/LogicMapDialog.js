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

const LogicMapDialog = () => {

  return (
    <div>
      <Dialog
        open={true}
      >
        <DialogTitle id="form-dialog-title">
          {`Define {nodeName}yarn`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Boring logic
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary">
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
};

export default LogicMapDialog
