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

const BranchItem = ({ labelText, logicDetail }) => (
	<div className={classes.branchItem}>
		<KeyboardArrowDown />
		<Typography>{labelText}</Typography>
		{logicDetail.length > 0 &&
			<IconButton 
				size='small'
				color='inherit'
				onClick={()=>{console.log('open logic dialog')}}
			>
				<Functions />
			</IconButton>
		}
		
	</div>
)

const renderTree = (node, cHeaders) => {
	return node.items ?
		(
			<li><BranchItem labelText={node.key} logicDetail={displayLogic(node) ? node.items : [] } />
				<ul>{node.items.map(n => renderTree(n, cHeaders))}</ul>
			</li>
		) : (
			<li><LeafItem labelText={node.key} /></li>
		)
} 

const TreeNav = ({currentHeaders, data}) => {

	return (
		<>
		<ul className={classes.treeList}>
			{data.map(n => renderTree(n, currentHeaders))}
		</ul>
		</>
	)
}

TreeNav.propTypes = {
  currentHeaders: PropTypes.objectOf(PropTypes.object).isRequired,
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default TreeNav
