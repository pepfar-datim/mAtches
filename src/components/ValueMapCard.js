import React from "react";
import PropTypes from "prop-types";

import { Card, Typography, Button } from "@material-ui/core";

import { Save, Publish } from "@material-ui/icons";

import ChipInput from "material-ui-chip-input";

import ValueMapUploadDialog from "./ValueMapUploadDialog";

import { stylesObj } from "../styling/stylesObj";

function generateChoiceMap(headerDefinitions, tempValueSet) {
  let tempChoiceMap = {};
  if (headerDefinitions.choiceMap) {
    tempChoiceMap = headerDefinitions.choiceMap;
  } else {
    for (let i = 0; i < tempValueSet.length; i += 1) {
      tempChoiceMap[tempValueSet[i].code] = {
        code: tempValueSet[i].code,
        valueType: tempValueSet[i].valueType,
      };
    }
  }
  return tempChoiceMap;
}

function loadValueSet(choiceMap, valueSet) {
  const tempChoiceMap = JSON.parse(JSON.stringify(choiceMap));
  let tempValueSet = JSON.parse(JSON.stringify(valueSet));
  const reverseChoiceMap = {};

  Object.keys(tempChoiceMap).forEach((k) => {
    if (
      !Object.prototype.hasOwnProperty.call(
        reverseChoiceMap,
        tempChoiceMap[k].code
      )
    ) {
      reverseChoiceMap[tempChoiceMap[k].code] = [];
    }
    reverseChoiceMap[tempChoiceMap[k].code].push(k);
  });

  tempValueSet = tempValueSet.map((mapItem) => {
    mapItem.maps = Object.prototype.hasOwnProperty.call(
      reverseChoiceMap,
      mapItem.code
    )
      ? reverseChoiceMap[mapItem.code]
      : [];
    return mapItem;
  });
  return tempValueSet;
}

class ValueMapCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      choiceMap: {},
      valueSet: [],
      valueMapUploadDialogOpen: false,
    };
    this.formatValueMap = this.formatValueMap.bind(this);
    this.formatChips = this.formatChips.bind(this);
    this.handleAddChip = this.handleAddChip.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleDialogChange = this.handleDialogChange.bind(this);
    this.handleValueMapUpdate = this.handleValueMapUpdate.bind(this);
  }

  componentDidMount() {
    const { header, map, mapCheck, mapID } = this.props;
    let tempValueSet = mapCheck.flatQuestionnaire[mapID].answerValueSet;
    const tempChoiceMap = generateChoiceMap(
      map.map.headers[header],
      tempValueSet
    );
    tempValueSet = loadValueSet(tempChoiceMap, tempValueSet);
    this.setState({ choiceMap: tempChoiceMap, valueSet: tempValueSet });
  }

  handleAddChip(chipText, index, code, valueType) {
    const { choiceMap, valueSet } = this.state;
    const chip = chipText.trim();
    if (!choiceMap[chip]) {
      const tempChoiceMap = JSON.parse(JSON.stringify(choiceMap));
      const tempValueSet = JSON.parse(JSON.stringify(valueSet));
      tempChoiceMap[chip] = { code, valueType };
      tempValueSet[index].maps.push(chip);
      this.setState({ choiceMap: tempChoiceMap, valueSet: tempValueSet });
    }
  }

  handleDeleteChip(chip, index) {
    const { choiceMap, valueSet } = this.state;
    const tempChoiceMap = JSON.parse(JSON.stringify(choiceMap));
    const tempValueSet = JSON.parse(JSON.stringify(valueSet));
    delete tempChoiceMap[chip];
    const filteredValueSet = tempValueSet[index].maps.filter((v) => v !== chip);
    tempValueSet[index].maps = filteredValueSet;
    this.setState({ choiceMap: tempChoiceMap, valueSet: tempValueSet });
  }

  handleDialogChange() {
    const { valueMapUploadDialogOpen } = this.state;
    this.setState({
      valueMapUploadDialogOpen: !valueMapUploadDialogOpen,
    });
  }

  handleValueMapUpdate(tempValueSet, tempChoiceMap) {
    this.setState({ valueSet: tempValueSet, choiceMap: tempChoiceMap });
    this.handleDialogChange();
  }

  formatValueMap(valueSet) {
    return valueSet.map((o, i) => (
      <div>
        <Typography variant="h6" style={stylesObj.marginQuarter}>
          <strong>{o.display}</strong>
          <br />
          {this.formatChips(o.maps, i, o.code, o.valueType)}
        </Typography>
        <br />
      </div>
    ));
  }

  formatChips(mapValues, index, code, valueType) {
    return (
      <div>
        <ChipInput
          value={mapValues}
          onAdd={(chip) => {
            this.handleAddChip(chip, index, code, valueType);
          }}
          onDelete={(chip) => {
            this.handleDeleteChip(chip, index, code, valueType);
          }}
        />
      </div>
    );
  }

  render() {
    const { header, map, onValueMapClose } = this.props;
    const { choiceMap, valueMapUploadDialogOpen, valueSet } = this.state;
    return (
      <Card style={stylesObj.valueMapCard}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6" style={stylesObj.marginQuarter}>
            <strong>Map Values</strong>
            <span>{` for ${header}`}</span>
            <br />
          </Typography>
          <Button
            style={stylesObj.valueMapButton}
            onClick={this.handleDialogChange}
          >
            Upload Values Map
            <Publish />
          </Button>
          {valueMapUploadDialogOpen && (
            <ValueMapUploadDialog
              handleValueMapUpdate={this.handleValueMapUpdate}
              header={header}
              onClose={this.handleDialogChange}
              open={valueMapUploadDialogOpen}
              valueSet={valueSet}
              uid={map.uid}
            />
          )}
          <br />
          <div style={stylesObj.marginQuarter}>
            {this.formatValueMap(valueSet)}
          </div>
          <Button
            variant="contained"
            style={stylesObj.valueMapContinueButton}
            onClick={(e) => onValueMapClose(e, choiceMap, header)}
          >
            Save and Close
            <Save style={stylesObj.marginQuarter} />
          </Button>
        </div>
      </Card>
    );
  }
}

export default ValueMapCard;

ValueMapCard.propTypes = {
  map: PropTypes.objectOf(PropTypes.object).isRequired,
  header: PropTypes.string.isRequired,
  onValueMapClose: PropTypes.func.isRequired,
  mapCheck: PropTypes.objectOf(PropTypes.object).isRequired,
  mapID: PropTypes.string.isRequired,
};
