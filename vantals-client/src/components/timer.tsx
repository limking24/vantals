import React from 'react';
import './timer.css';

function padZero(number: number): string {
	return ('00'+number).slice(-2);
}

interface Props {
	paused: boolean,
	interval: number,
	toggle: () => void,
	changeInterval: (interval: number) => void,
	refresh: () => Promise<void>
}

interface State {
	minute: number,
	second: number,
	interval: number,
	showSetting: boolean
}

class Timer extends React.Component<Props, State> {

	state: State = {
		minute: this.props.interval,
		second: 0,
		interval: this.props.interval,
		showSetting: false
	};

	id?: NodeJS.Timer = undefined;

	isRefreshing = false;

	componentDidMount(): void {
		if (!this.props.paused) {
			this.startCountdown();
		}
	}

	startCountdown(): void {
		this.id = setInterval(() => this.countdown(), 1000);
	}

	stopCountdown(): void {
		if (this.id) {
			clearInterval(this.id);
		}
	}

	countdown(): void {
		if (this.state.minute > 0) {
			if (this.state.second > 0) {
				this.setState({second: this.state.second - 1});
			} else {
				this.setState({
					minute: this.state.minute - 1,
					second: 59
				});
			}
		} else {
			let second = this.state.second - 1;
			this.setState({second}, (second > 0 ? undefined : () => this.refresh()));
		}
	}

	start(): void {
		this.startCountdown();
		this.props.toggle();
	}

	pause(): void {
		this.stopCountdown();
		this.props.toggle();
	}

	refresh(): void {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			this.stopCountdown();
			this.setState({minute: 0, second: 0}, async () => {
				await this.props.refresh();
				await this.resetTimer();
				this.isRefreshing = false;
				if (!this.props.paused) {
					this.startCountdown();
				}
			});
		}
	}

	showSetting(): void {
		this.setState({
			interval: this.props.interval,
			showSetting: true
		});
	}

	hideSetting(): void {
		this.setState({showSetting: false});
	}

	updateInterval(): void {
		this.resetTimer();
		this.props.changeInterval(this.state.interval);
		this.hideSetting();
	}

	resetTimer(): Promise<void> {
		return new Promise(resolve => {
			this.setState({
				minute: this.state.interval,
				second: 0
			}, resolve);
		});
	}

	render(): JSX.Element {
		return (
			<div className="timer">
				{/* Timer */}
				<div className="remaining">
					{ this.state.minute === 0 && this.state.second === 0 ? (
						<span>Refreshing</span>
					) : (
						<span>
							Refreshing in&nbsp;
							{`${padZero(this.state.minute)}:${padZero(this.state.second)}`}
						</span>
					)}
				</div>

				{/* Icons */}
				<img src={process.env.PUBLIC_URL + '/start.svg'} alt="Start" onClick={this.start.bind(this)} className={this.props.paused ? '' : 'hidden'}/>
				<img src={process.env.PUBLIC_URL + '/pause.svg'} alt="Pause" onClick={this.pause.bind(this)} className={this.props.paused ? 'hidden' : ''}/>
				<img src={process.env.PUBLIC_URL + '/refresh.svg'} alt="Refresh" className="smaller" onClick={this.refresh.bind(this)}/>
				<img src={process.env.PUBLIC_URL + '/setting.svg'} alt="Setting" onClick={this.showSetting.bind(this)}/>

				{/* Setting */}
				<div className={`setting-container ${this.state.showSetting ? '' : 'hidden'}`}>
					<div className="setting">
						<div>
							Interval:&nbsp;
							<select value={this.state.interval} onChange={(e) => this.setState({interval: Number(e.target.value)})}>
								<option>1</option>
								<option>5</option>
								<option>10</option>
								<option>15</option>
								<option>30</option>
								<option>45</option>
								<option>60</option>
							</select>
							&nbsp;minute
						</div>
						<div className="buttons">
							<button onClick={this.updateInterval.bind(this)} 
									disabled={this.state.interval === this.props.interval}>Confirm</button>
							<button onClick={this.hideSetting.bind(this)}>Cancel</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}

export default Timer;