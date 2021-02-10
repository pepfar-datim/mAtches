import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  Typography,
  TextField,
  InputAdornment,
  Grid,
  Button,
  IconButton,
  MobileStepper,
} from "@material-ui/core";

// import SearchTextComponent from "./SearchTextComponent.js";

import {
  Search,
  Sync,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";
import api from "../services/api";

import { stylesObj } from "../styling/stylesObj";

function formatMapList(
  maps,
  searchText,
  currentMapID,
  onMapProcess,
  currentStep,
  numberOfMaps
) {
  return maps
    .filter((m) => {
      if (m.uid === currentMapID) {
        return false;
      }
      if (!searchText.trim().length) {
        return true;
      }
      return m.name.toLowerCase().includes(searchText.trim().toLowerCase());
    })
    .slice(currentStep * numberOfMaps, (currentStep + 1) * numberOfMaps)
    .map((k) => (
      <div>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={() => {
                onMapProcess(k.uid);
              }}
            >
              <Sync />
            </IconButton>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Typography align="left" noWrap>
              {k.name}
            </Typography>
          </Grid>
        </Grid>
      </div>
    ));
}

const NavButton = (props) => {
  const { disabled, onClick, orientation } = props;
  return orientation === "left" ? (
    <Button size="small" onClick={onClick} disabled={disabled}>
      <KeyboardArrowLeft />
      Back
    </Button>
  ) : (
    <Button size="small" onClick={onClick} disabled={disabled}>
      <KeyboardArrowRight />
      Next
    </Button>
  );
};

NavButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  orientation: PropTypes.string.isRequired,
};

class UploadMapList extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      maps: [],
      searchText: "",
      currentStep: 0,
      numberOfMaps: 3,
      maxSteps: 0,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getMaps();
  }

  handleNext() {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  handleBack() {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1 });
  }

  handleSearchTextChange(newText) {
    const { currentStep, maps, numberOfMaps } = this.state;
    let tempMax = Math.ceil(maps.length / numberOfMaps);
    let tempStep = currentStep;
    if (newText.trim().length !== 0) {
      const tempLength = maps.filter((m) =>
        m.name.toLowerCase().includes(newText.trim().toLowerCase())
      ).length;
      tempMax = Math.ceil(tempLength / numberOfMaps);
      tempStep = Math.min(currentStep, tempMax - 1);
    }
    this.setState({
      searchText: newText,
      currentStep: tempStep,
      maxSteps: tempMax,
    });
  }

  getMaps() {
    const { numberOfMaps } = this.state;
    api.get("api/maps").then((maps) => {
      this.setState({
        maps,
        maxSteps: Math.ceil(maps.length / numberOfMaps),
      });
    });
  }

  render() {
    const {
      currentStep,
      maps,
      maxSteps,
      numberOfMaps,
      searchText,
    } = this.state;
    const { id, onMapProcess } = this.props;
    return (
      <div style={stylesObj.themePadding}>
        <TextField
          id="narrowdown-search"
          label="Narrow down maps"
          onChange={(e) => this.handleSearchTextChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <br />
        <br />
        {formatMapList(
          maps,
          searchText,
          id,
          onMapProcess,
          currentStep,
          numberOfMaps
        )}
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={currentStep}
          backButton={
            <NavButton onClick={this.handleBack} orientation="left" />
          }
          nextButton={
            <NavButton onClick={this.handleNext} orientation="right" />
          }
        />
      </div>
    );
  }
}

UploadMapList.propTypes = {
  id: PropTypes.string.isRequired,
  onMapProcess: PropTypes.func.isRequired,
};

export default UploadMapList;
