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

	api = new VantalsApi('http://localhost:8000/');

	state: State = {
		timerPaused: localStorage.getItem('timer-paused') === 'true',
		timerInterval: Number(localStorage.getItem('timer-interval')) || 1,
		loading: true
	};

	constructor(props: any) {
		super(props);
		this.loadListings();
	}

	loadListings(): void {
		this.api.getListings().then(listings => {
			this.setState({
				loading: false,
				listings
			});
		});
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
