import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Chip } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

import { stylesObj } from "./styling/stylesObj.js";

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export default function TreeNavigation(props) {
  const classes = useStyles();

  const renderTree = (nodes, currentHeaders) =>
    nodes.hasOwnProperty("items") ? (
      <TreeItem key={nodes.key} nodeId={nodes.id} label={nodes.key}>
        {nodes.items.map((node) => renderTree(node, currentHeaders))}
      </TreeItem>
    ) : (
      <div>
        <Chip
          label={nodes.key}
          style={
            currentHeaders[nodes.id].path
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
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      defaultExpanded={props.data.map((m) => m.id)}
    >
      {props.data.map((node) => renderTree(node, props.currentHeaders))}
    </TreeView>
  );
}
