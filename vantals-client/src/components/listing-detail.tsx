import React from 'react';
import { Listing } from 'vantals-common/src/models/listing';
import './listing-detail.css';

interface Props {
	listing: Listing
}

export default class ListingDetail extends React.Component<Props> {

	render(): JSX.Element {
		return (
			<div className="listing">
				<a href={this.props.listing.hyperlink.href} target="_blank" rel="noreferrer">
					<div className="left">
						<img src={this.props.listing.photo.href} alt="Preview"/>
					</div>
					<div className="right">
						<h2 className="title">
							{this.props.listing.title}
						</h2>
						<div className="description" dangerouslySetInnerHTML={{__html: this.props.listing.description}}/>
						<div className="metadata">
							<span>{this.props.listing.location}</span>
							{this.props.listing.price && <span>${this.props.listing.price}</span>}
							<span>{this.props.listing.source}</span>
							<span>{this.props.listing.time.toLocaleString()}</span>
						</div>
					</div>
				</a>
			</div>
		);
	}

};