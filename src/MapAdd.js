import React, { Component } from "react";
import {
  Paper,
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@material-ui/core";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import config from "../config.json";
import api from "./services/api.js";

import { stylesObj } from "./styling/stylesObj.js";

class MapAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidName: false,
      questionnaire: "",
      name: "",
      fileType: "",
    };
    this.handleSelectChange.bind(this);
  }

  handleSelectChange(value, key) {
    this.setState({ [key]: value });
  }

  handleNameChange(event) {
    var tempName = event.target.value;
    if (this.state.timeout) {
      clearTimeout(this.state.timeout);
    }
    this.setState({
      checking: true,
      name: tempName,
      timeout: setTimeout(() => {
        this.checkName(tempName, this);
      }, 1000),
    });
  }

  checkName(name, _this) {
    api.get("api/maps/names/" + encodeURI(name)).then((nameFound) => {
      _this.setState({
        invalidName: nameFound.hasOwnProperty("uid"),
        checking: false,
      });
    });
  }

  handleAdd() {
    if (!this.state.invalidName) {
      var payload = {
        map: { headers: {}, constants: {} },
        fileType: this.state.fileType,
        name: this.state.name,
        questionnaireuid: this.state.questionnaire,
      };
      api.post("api/maps", payload).then((response) => {
        window.location = config.base + "maps/" + response.uid + "?mode=edit";
      });
    }
  }

  render() {
    const questionnaireHash = this.props.questionnaireHash;
    return this.state.loading ? (
      <CircularProgress style={stylesObj.loaderStyling} />
    ) : (
      <div>
        <div style={stylesObj.themePadding}>
          <Paper style={stylesObj.addBox}>
            <div style={stylesObj.themePadding}>
              <Typography variant="h6" style={stylesObj.themePaddingBottom}>
                Create a new map
              </Typography>
              <FormControl
                style={{
                  ...stylesObj.themeWidth,
                  ...stylesObj.themePaddingBottom,
                }}
              >
                <InputLabel shrink htmlFor="questionnaire-select">
                  Questionnaire
                </InputLabel>
                <Select
                  value={this.state.questionnaire}
                  displayEmpty
                  name="questionnaire"
                  onChange={(e) =>
                    this.handleSelectChange(e.target.value, "questionnaire")
                  }
                >
                  {Object.keys(questionnaireHash).map((uid, index) => (
                    <MenuItem value={uid}>{questionnaireHash[uid]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <FormControl style={{ ...stylesObj.themeWidth }}>
                <InputLabel shrink htmlFor="fileType-select">
                  File Type
                </InputLabel>
                <Select
                  value={this.state.fileType}
                  displayEmpty
                  name="fileType"
                  onChange={(e) =>
                    this.handleSelectChange(e.target.value, "fileType")
                  }
                >
                  >
                  {["csv", "json"].map((type) => (
                    <MenuItem value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <br />
              <TextField
                style={stylesObj.themeWidth}
                id="name-entry"
                label="Name"
                value={this.state.name}
                margin="normal"
                onChange={this.handleNameChange.bind(this)}
                error={this.state.invalidName}
                helperText={this.state.invalidName && "Name already used"}
              />
              <br />
              <IconButton
                edge="start"
                aria-label="menu"
                disabled={
                  this.state.invalidName ||
                  this.state.checking ||
                  !this.state.name ||
                  !this.state.questionnaire ||
                  !this.state.fileType
                }
                id="addMapButton"
                onClick={this.handleAdd.bind(this)}
              >
                <AddCircleOutlinedIcon />
              </IconButton>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

export default MapAdd;
