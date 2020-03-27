import React, {useState} from 'react';
import {Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core/';

import {stylesObj} from './styling/stylesObj.js'

export default function ConstantDialog(props) {

  const [constantText, setConstantText] = useState('');
  const [constantCode, setConstantCode] = useState('');
  const choiceValue = !!props.valueArray.length;
  if (choiceValue == true) {
    var choiceCodeMap = props.valueArray.reduce((tempChoiceCodeMap, currentValue) => {
      tempChoiceCodeMap[currentValue.Code] = currentValue.Display;
      return tempChoiceCodeMap
    }, {});
  }
  return (
    <div>
      <Dialog open={props.open} onClose={props.closeConstantMapDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">map <strong>{props.constantHeader}</strong> to constant</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {choiceValue ? 'Select' : 'Enter'} your constant value.
          </DialogContentText>
          {(choiceValue != true) &&
            <TextField
              autoFocus
              margin="dense"
              id="constant_entry"
              type="constant"
              value={constantCode}
              onChange={(e) => {setConstantText(e.target.value); setConstantCode(e.target.value)} }
              fullWidth

            />
          }
          {(choiceValue == true) &&
            <FormControl style={stylesObj.themeWidth}>
              <InputLabel shrink htmlFor="questionnaire-select">
                Select Value
              </InputLabel>
              <Select value={constantCode} displayEmpty name="questionnaire" onChange={(e) => {setConstantText(choiceCodeMap[e.target.value]); setConstantCode(e.target.value)} }>
                {props.valueArray.map((i, index) =>
                    <MenuItem key={index + '_ConstantMap'} value={i.code}>{i.display}</MenuItem>
                )}     
              </Select>
            </FormControl>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeConstantMapDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => {
              props.setConstant(props.qID, 'add', {'display': constantText, 'code': constantCode, 'valueType':props.valueType, 'path': props.path});
              props.closeConstantMapDialog()
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
