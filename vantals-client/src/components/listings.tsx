import React from 'react';
import { Listing } from 'vantals-common/src/models/listing';
import ListingDetail from './listing-detail';
import './listings.css';

interface Props {
	listings: Listing[]
}

export default class Listings extends React.Component<Props> {

	render(): JSX.Element {
		return (
			<div className="listings">
				{
					this.props.listings.map((listing, i) => (
						<ListingDetail listing={listing} key={i}/>
					))
				}
			</div>
		);
	}

};