import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  Typography,
  IconButton,
  MenuItem,
  FormControl,
  Select,
  Button,
  Tooltip,
} from "@material-ui/core";

import SendIcon from "@material-ui/icons/Send";
import MapIcon from "@material-ui/icons/Map";
import LinkIcon from "@material-ui/icons/Link";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import RequiredNonRequiredSelector from "./RequiredNonRequiredSelector";
import ConstantDialog from "./ConstantDialog";
import SendButtonTooltip from "./SendButtonTooltip";

import api from "../services/api";

import config from "../../config.json";

import { stylesObj } from "../styling/stylesObj";

const getValueMapButtonStyle = (questionnaireItem, mapItem) => {
  if (!(questionnaireItem.header || "").length) {
    return stylesObj.editCardSelectorButtonDisabled;
  }
  const tempChoiceMap = mapItem.choiceMap || {};
  if (Object.entries(tempChoiceMap).length) {
    return stylesObj.editCardSelectorButtonComplete;
  }
  return stylesObj.editCardSelectorButtonIncomplete;
};

const formatMenuItems = (currentMap) =>
  Object.keys(currentMap.headers).map((k) => (
    <MenuItem value={k}>{k}</MenuItem>
  ));

const formatSelect = (header, key, map, associationFunction) => (
  <FormControl style={stylesObj.editCardSelector}>
    <Select
      value={header || ""}
      onChange={associationFunction}
      name={key}
      data_cy={`${key}_selectItem`}
    >
      {formatMenuItems(map)}
    </Select>
  </FormControl>
);

const formatQuestions = (
  mapCheck,
  map,
  associationFunction,
  valueMapFunction,
  constantChange,
  setConstantDialogOpen,
  itemVisibility
) =>
  Object.keys(mapCheck.flatQuestionnaire).map((k) => {
    // let mappedToConstant = !!((Object.keys(mapCheck.flatQuestionnaire[k].constant) || '').length);
    const mappedToConstant = !!Object.keys(
      mapCheck.flatQuestionnaire[k].constant || {}
    ).length;
    const mappedToHeader = !!(mapCheck.flatQuestionnaire[k].header || "")
      .length;
    const mappedItem = mappedToConstant || mappedToHeader;
    return (
      <>
        {(itemVisibility === "all" ||
          mapCheck.flatQuestionnaire[k].required) && (
          <div key={`question-${k}`} style={stylesObj.editCardSelectorPadding}>
            <Typography
              wrap="noWrap"
              style={
                mappedItem
                  ? stylesObj.completeQuestion
                  : stylesObj.incompleteQuestion
              }
            >
              <strong>
                {mapCheck.flatQuestionnaire[k].required && "* "}
                {mapCheck.flatQuestionnaire[k].text}
              </strong>
              {!mappedToConstant && (
                <Tooltip title="Replace this item with a constant value">
                  <IconButton
                    onClick={() => {
                      let tempValueMap = [];
                      if (
                        mapCheck.flatQuestionnaire[k].valueType === "choice"
                      ) {
                        tempValueMap =
                          mapCheck.flatQuestionnaire[k].answerValueSet;
                      }
                      setConstantDialogOpen(
                        mapCheck.flatQuestionnaire[k].text,
                        k,
                        tempValueMap,
                        mapCheck.flatQuestionnaire[k].valueType,
                        mapCheck.flatQuestionnaire[k].path
                      );
                    }}
                  >
                    <LinkIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
            {!mappedToConstant && (
              <div>
                {formatSelect(
                  mapCheck.flatQuestionnaire[k].header,
                  k,
                  map,
                  associationFunction
                )}
                <br />
                {mapCheck.flatQuestionnaire[k].valueType === "choice" && (
                  <Button
                    variant="contained"
                    style={getValueMapButtonStyle(
                      mapCheck.flatQuestionnaire[k],
                      map.headers[mapCheck.flatQuestionnaire[k].header] || {}
                    )}
                    onClick={() => {
                      valueMapFunction(mapCheck.flatQuestionnaire[k].header, k);
                    }}
                    disabled={
                      !(mapCheck.flatQuestionnaire[k].header || "").length
                    }
                  >
                    Map values
                    <MapIcon style={stylesObj.editCardSelectorButtonIcon} />
                  </Button>
                )}
              </div>
            )}
            {mappedToConstant && (
              <Typography wrap="noWrap">
                <span>
                  {`Constant value: ${mapCheck.flatQuestionnaire[k].constant.display}`}
                </span>
                <Tooltip title="Remove link to constant value and map to header">
                  <IconButton
                    onClick={() => {
                      constantChange(k, "delete");
                    }}
                  >
                    <LinkOffIcon />
                  </IconButton>
                </Tooltip>
              </Typography>
            )}
          </div>
        )}
      </>
    );
  });

class EditCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonDelay: false,
      constantDialogOpen: false,
      constantHeader: "",
      qID: "",
      valueType: "",
      headerPath: [],
      itemVisibility: "all",
    };
    this.setConstantDialogOpen = this.setConstantDialogOpen.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.sendMap = this.sendMap.bind(this);
  }

  handleVisibilityChange(text) {
    this.setState({ itemVisibility: text });
  }

  setConstantDialogOpen(ch, qID, vm, vt, path) {
    const { constantDialogOpen } = this.state;
    const tempConstantHeader = typeof ch === "string" ? ch : "";
    const tempQID = typeof qID === "string" ? qID : "";
    const tempValueMap = Array.isArray(vm) ? vm : [];
    const tempValueType = typeof vt === "string" ? vt : "";
    const tempPath = Array.isArray(path) ? path : [];
    this.setState({
      constantDialogOpen: !constantDialogOpen,
      constantHeader: tempConstantHeader,
      qID: tempQID,
      valueMap: tempValueMap,
      valueType: tempValueType,
      headerPath: tempPath,
    });
  }

  sendMap() {
    // disable for testing
    const { map } = this.props;
    api.sendMap(map).then((resp) => {
      console.log(resp);
    });
    this.setState({
      buttonDelay: true,
      submittedMap: JSON.parse(JSON.stringify(map)),
    });
    setTimeout(() => {
      this.setState({ buttonDelay: false });
    }, 10000);
  }

  render() {
    const {
      constantChange,
      mapCheck,
      map,
      mapValidity,
      onAssociation,
      onValueMap,
      unmappedHeaders,
    } = this.props;
    const {
      buttonDelay,
      constantDialogOpen,
      constantHeader,
      qID,
      valueMap,
      valueType,
      headerPath,
      itemVisibility,
      submittedMap,
    } = this.state;

    const mapUnchanged = JSON.stringify(submittedMap) === JSON.stringify(map);
    const buttonDisabled =
      (Object.keys(unmappedHeaders).length > 0 && map.fileType !== "json") ||
      !mapValidity ||
      buttonDelay ||
      mapUnchanged;
    const buttonUploadStyling = buttonDisabled
      ? stylesObj.editCardUploadButtonDisabled
      : stylesObj.editCardUploadButtonEnabled;
    return (
      <Card style={stylesObj.editCard}>
        <div style={stylesObj.themePadding}>
          <Typography variant="h6" style={stylesObj.marginQuarterBottom}>
            <strong>Map Source Headers to Target Questions</strong>
          </Typography>
          <Typography variant="body1" style={stylesObj.marginQuarterBottom}>
            <strong>*</strong>
            denotes required item
          </Typography>

          <RequiredNonRequiredSelector
            itemVisibility={itemVisibility}
            handleVisibilityChange={this.handleVisibilityChange}
          />

          <div style={stylesObj.themePaddingQuarter}>
            {mapCheck && map && (
              <div>
                {formatQuestions(
                  mapCheck,
                  map.map,
                  onAssociation,
                  onValueMap,
                  constantChange,
                  this.setConstantDialogOpen,
                  itemVisibility
                )}
              </div>
            )}
          </div>
        </div>

        <Tooltip
          title={
            !buttonDisabled ? (
              ""
            ) : (
              <SendButtonTooltip
                mapUnchanged={mapUnchanged}
                tempDelay={buttonDelay}
                unmappedHeaders={unmappedHeaders}
                flatQuestionnaire={mapCheck.flatQuestionnaire}
              />
            )
          }
        >
          <div style={stylesObj.editCardUploadButtonDiv}>
            <Button
              variant="contained"
              style={buttonUploadStyling}
              onClick={this.sendMap}
              disabled={buttonDisabled}
            >
              Submit to&nbsp;
              {config.externalMappingLocation}
              <SendIcon style={stylesObj.marginQuarter} />
            </Button>
          </div>
        </Tooltip>
        {constantDialogOpen && (
          <ConstantDialog
            open={constantDialogOpen}
            closeConstantMapDialog={this.setConstantDialogOpen}
            constantHeader={constantHeader}
            qID={qID}
            setConstant={constantChange}
            valueArray={valueMap}
            valueType={valueType}
            path={headerPath}
          />
        )}
      </Card>
    );
  }
}

EditCard.propTypes = {
  constantChange: PropTypes.func.isRequired,
  mapCheck: PropTypes.objectOf(PropTypes.object).isRequired,
  map: PropTypes.objectOf(PropTypes.object).isRequired,
  mapValidity: PropTypes.bool.isRequired,
  onAssociation: PropTypes.func.isRequired,
  onValueMap: PropTypes.func.isRequired,
  unmappedHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default EditCard;
