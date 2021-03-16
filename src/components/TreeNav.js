import React from "react";
import PropTypes from "prop-types";

import { Chip, IconButton, Tooltip, Typography } from "@material-ui/core";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import Functions from "@material-ui/icons/Functions";
import classes from "../styling/TreeNav.module.css";

import { stylesObj } from "../styling/stylesObj";

const displayLogic = (node) => {
  if (node.type !== "array") {
    return false;
  }
  if (node.items.filter((i) => i.type === "object").length > 0) {
    return true;
  }
  return false;
};

const LeafItem = ({ cHeaders, node }) => (
  <div>
    <div>
      <Chip
        label={node.key}
        style={
          cHeaders[node.id] && cHeaders[node.id].path
            ? stylesObj.mappedChip
            : stylesObj.unmappedChip
        }
      />
    </div>
  </div>
);

LeafItem.propTypes = {
  cHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  node: PropTypes.objectOf(PropTypes.object).isRequired,
};

const LogicLeafItem = ({
  cHeaders,
  handleDeleteLogicLeaf,
  logic,
  parentKey,
}) => (
  <div>
    <Tooltip
      title={(
        <div>
          <p>Logic for <strong>{parentKey}</strong></p>
          <p>{logic.fhirPath}</p>
        </div>
      )}
    >
      <div>
        <Chip
          icon={<Functions />}
          onDelete={() => {
            handleDeleteLogicLeaf(logic);
          }}
          label={logic.alias}
          style={
            cHeaders[logic.alias].path
              ? stylesObj.mappedChip
              : stylesObj.unmappedChip
          }
        />
      </div>
    </Tooltip>
  </div>
);

LogicLeafItem.propTypes = {
  cHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  handleDeleteLogicLeaf: PropTypes.func.isRequired,
  logic: PropTypes.objectOf(PropTypes.object).isRequired,
  parentKey: PropTypes.string.isRequired,
};

const BranchItem = ({ labelText, node, setNode }) => (
  <div className={classes.branchItem}>
    <KeyboardArrowDown />
    <Typography>{labelText}</Typography>
    {node.items && (
      <IconButton
        size="small"
        color="inherit"
        onClick={() => {
          setNode(node);
        }}
      >
        <Functions />
      </IconButton>
    )}
  </div>
);

BranchItem.propTypes = {
  labelText: PropTypes.string.isRequired,
  node: PropTypes.objectOf(PropTypes.object).isRequired,
  setNode: PropTypes.func.isRequired,
};

const renderTree = (node, cHeaders, handleDeleteLogicLeaf, setNode) => {
  if (node.logic && node.logic.length) {
    return (
      <li>
        <BranchItem
          setNode={setNode}
          labelText={node.key}
          node={displayLogic(node) ? node : {}}
        />
        <ul>
          {node.logic.map((logicRules) => (
            <li>
              <LogicLeafItem
                logic={logicRules}
                cHeaders={cHeaders}
                handleDeleteLogicLeaf={handleDeleteLogicLeaf}
                parentKey={node.key}
              />
            </li>
          ))}
        </ul>
      </li>
    );
  }
  if (node.items) {
    return (
      <li>
        <BranchItem
          setNode={setNode}
          labelText={node.key}
          node={displayLogic(node) ? node : {}}
        />
        <ul>
          {node.items.map((n) =>
            renderTree(n, cHeaders, handleDeleteLogicLeaf, setNode)
          )}
        </ul>
      </li>
    );
  }
  return (
    <li>
      <LeafItem node={node} cHeaders={cHeaders} />
    </li>
  );
};

const TreeNav = ({ currentHeaders, handleDeleteLogicLeaf, data, setNode }) => (
  <>
    <ul className={classes.treeList}>
      {data.map((n) =>
        renderTree(n, currentHeaders, handleDeleteLogicLeaf, setNode)
      )}
    </ul>
  </>
);

TreeNav.propTypes = {
  currentHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  handleDeleteLogicLeaf: PropTypes.func.isRequired,
  setNode: PropTypes.func.isRequired,
};

export default TreeNav;
