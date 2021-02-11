import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import { stylesObj } from "../styling/stylesObj";

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function TreeNavigation(props) {
  const { currentHeaders, data } = props;
  const classes = useStyles();

  const renderTree = (nodes, cHeaders) =>
    nodes.items ? (
      <TreeItem key={nodes.key} nodeId={nodes.id} label={`${nodes.key}_logic`}>
        {nodes.items.map((node) => renderTree(node, cHeaders))}
      </TreeItem>
    ) : (
      <div>
        <Chip
          label={nodes.key}
          style={
            cHeaders[nodes.id].path
              ? stylesObj.mappedChip
              : stylesObj.unmappedChip
          }
        />
      </div>
    );

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={data.map((m) => m.id)}
    >
      {data.map((node) => renderTree(node, currentHeaders))}
    </TreeView>
  );
}

TreeNavigation.propTypes = {
  currentHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};
