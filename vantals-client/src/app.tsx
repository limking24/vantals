import { backOff } from 'exponential-backoff';
import React from 'react';
import { Listing } from 'vantals-common/src/models/listing';
import { VantalsApi } from './api/vantals-api';
import './app.css';
import Listings from './components/listings';
import Timer from './components/timer';

interface State {
	timerPaused: boolean,
	timerInterval: number,
	loading: boolean,
	listings?: Listing[]
}

export default class App extends React.Component<{}, State> {

	api = new VantalsApi(process.env.REACT_APP_VANTALS_API_BASE_URL!);

	lastLoadTime = new Date();

	state: State = {
		timerPaused: localStorage.getItem('timer-paused') === 'true',
		timerInterval: Number(localStorage.getItem('timer-interval')) || 1,
		loading: true
	};

	constructor(props: any) {
		super(props);
		this.loadListings();
	}

	async loadListings(): Promise<void> {
		const params = new URLSearchParams(document.location.search);
		await backOff(async () => {
			let listings = await this.api.getListings({
				minPrice: parseInt(params.get('minPrice') || ''),
				maxPrice: parseInt(params.get('maxPrice') || '')
			});
			this.setState({
				loading: false,
				listings
			}, () => {
				let index = Math.max(listings.findIndex(l => l.time < this.lastLoadTime) - 1, 0);
				document.getElementsByClassName('listing')[index].scrollIntoView();
				this.lastLoadTime = new Date();
			});
		}, { numOfAttempts: 10, timeMultiple: 5});
	}

	toggleTimer(): void {
		let timerPaused = !this.state.timerPaused;
		this.setState({timerPaused});
		localStorage.setItem('timer-paused', String(timerPaused));
	}

	updateTimerInterval(interval: number): void {
		this.setState({timerInterval: interval});
		localStorage.setItem('timer-interval', String(interval));
	}

	refreshListings(): Promise<void> {
		this.setState({loading: true}, () => this.loadListings());
		return Promise.resolve();
	}

	render(): JSX.Element {
		return (
			<div className="app">
				{ this.state.loading ? (
					<div className="lds-ripple">
						<div/>
						<div/>
					</div>
				) : (
					<Listings listings={this.state.listings!}/>
				) }
				<Timer paused={this.state.timerPaused}
					   interval={this.state.timerInterval}
					   toggle={this.toggleTimer.bind(this)}
					   changeInterval={this.updateTimerInterval.bind(this)}
					   refresh={this.refreshListings.bind(this)}/>
			</div>
		);
	}

};
