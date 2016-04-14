import React from "react";
import utils from "common/utils";
import asset_utils from "common/asset_utils";
import ChainTypes from "./ChainTypes";
import BindToChainState from "./BindToChainState";

@BindToChainState()
class AssetName extends React.Component {

	static propTypes = {
		asset: ChainTypes.ChainAsset.isRequired,
		replace: React.PropTypes.bool.isRequired,
		name: React.PropTypes.string.isRequired
	};

	static defaultProps = {
		replace: true,
		withTooltip: false
	};

	shouldComponentUpdate(nextProps) {
		return (
			nextProps.withTooltip !== this.props.withTooltip ||
			nextProps.replace !== this.props.replace ||
			nextProps.name !== this.props.replace
		);
	}

	render() {
		let {name, replace, asset, withTooltip} = this.props;

		let replacedName = utils.replaceName(name);
		let dispName = replace ? replacedName : name;
		if (withTooltip) {
			let desc = asset_utils.parseDescription(asset.getIn(["options", "description"]));
			desc = utils.htmlify(desc.short || desc.main);
			let tooltip = `<div><strong>${this.props.name}</strong><br />${desc}</div>`;
			return <span className="tooltip" data-tip={tooltip} data-place="bottom" data-type="light" data-html>{dispName}</span>
		} else {
			return <span>{dispName}</span>;
		}
	}
}

export default class AssetNameWrapper extends React.Component {

	render() {
		return (
			<AssetName {...this.props} asset={this.props.name} />
		);
	}
}
