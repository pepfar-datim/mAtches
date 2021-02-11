import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  CircularProgress,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@material-ui/core";

import AddCircleOutlinedIcon from "@material-ui/icons/AddCircleOutlined";

import config from "../../config.json";
import api from "../services/api";

import { stylesObj } from "../styling/stylesObj";

const generateFileTypeMenuItems = (fileTypes) =>
  fileTypes.map((type) => <MenuItem value={type}>{type}</MenuItem>);

class MapAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidName: false,
      questionnaire: "",
      name: "",
      fileType: "",
    };
    this.checkName = this.checkName.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(value, key) {
    this.setState({ [key]: value });
  }

  handleNameChange(event) {
    const { timeout } = this.state;
    const tempName = event.target.value;
    if (timeout) {
      clearTimeout(timeout);
    }
    this.setState({
      checking: true,
      name: tempName,
      timeout: setTimeout(() => {
        this.checkName(tempName);
      }, 1000),
    });
  }

  handleAdd() {
    const { fileType, invalidName, name, questionnaire } = this.state;
    if (!invalidName) {
      const payload = {
        map: { headers: {}, constants: {} },
        fileType,
        name,
        questionnaireuid: questionnaire,
      };
      api.post("api/maps", payload).then((response) => {
        window.location = `${config.base}maps/${response.uid}?mode=edit`;
      });
    }
  }

  checkName(name) {
    api.get(`api/maps/names/${encodeURI(name)}`).then((nameFound) => {
      this.setState({
        invalidName: Boolean(nameFound.uid),
        checking: false,
      });
    });
  }

  render() {
    const { questionnaireHash } = this.props;
    const {
      checking,
      fileType,
      invalidName,
      loading,
      name,
      questionnaire,
    } = this.state;
    return loading ? (
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
                  value={questionnaire}
                  displayEmpty
                  name="questionnaire"
                  onChange={(e) =>
                    this.handleSelectChange(e.target.value, "questionnaire")
                  }
                >
                  {Object.keys(questionnaireHash).map((uid) => (
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
                  value={fileType}
                  displayEmpty
                  name="fileType"
                  onChange={(e) => {
                    console.log("selected", e.target.value);
                    this.handleSelectChange(e.target.value, "fileType");
                  }}
                >
                  {generateFileTypeMenuItems(["csv", "json"])}
                </Select>
              </FormControl>
              <br />
              <TextField
                style={stylesObj.themeWidth}
                id="name-entry"
                label="Name"
                value={name}
                margin="normal"
                onChange={this.handleNameChange}
                error={invalidName}
                helperText={invalidName && "Name already used"}
              />
              <br />
              <IconButton
                edge="start"
                aria-label="menu"
                disabled={
                  invalidName ||
                  checking ||
                  !name ||
                  !questionnaire ||
                  !fileType
                }
                id="addMapButton"
                onClick={this.handleAdd}
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

MapAdd.propTypes = {
  questionnaireHash: PropTypes.string.isRequired,
};

export default MapAdd;
