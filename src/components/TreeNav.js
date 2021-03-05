import React from "react";
import PropTypes from "prop-types";

import classes from '../styling/TreeNav.module.css'
import { IconButton, Typography } from "@material-ui/core";
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Functions from '@material-ui/icons/Functions';


const displayLogic = (node) => {
	if (node.type !== "array") {
		return false
	}
	if (node.items.filter(i => i.type === "object").length > 0) {
		return true
	}
	return false
}

const LeafItem = ({ labelText }) => (
	<div>
		<Typography>{labelText}</Typography>		
	</div>
)

const BranchItem = ({ labelText, node, setNode }) => (
	<div className={classes.branchItem}>
		<KeyboardArrowDown />
		<Typography>{labelText}</Typography>
		{node.items &&
			<IconButton 
				size='small'
				color='inherit'
				onClick={()=>{setNode(node)}}
			>
				<Functions />
			</IconButton>
		}
		
	</div>
)

const renderTree = (node, cHeaders, setNode) => {
	return node.items ?
		(
			<li><BranchItem setNode={setNode} labelText={node.key} node={displayLogic(node) ? node : {} } />
				<ul>{node.items.map(n => renderTree(n, cHeaders, setNode))}</ul>
			</li>
		) : (
			<li><LeafItem labelText={node.key} /></li>
		)
} 

const TreeNav = ({currentHeaders, data, setNode}) => {

	return (
		<>
		<ul className={classes.treeList}>
			{data.map(n => renderTree(n, currentHeaders, setNode))}
		</ul>
		</>
	)
}

TreeNav.propTypes = {
  currentHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  setNode: PropTypes.func.isRequired,
};

export default TreeNav
