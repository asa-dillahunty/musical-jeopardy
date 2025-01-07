import React, { useState, useEffect } from 'react';
import { BsArrowClockwise, BsPauseFill, BsPlayFill } from 'react-icons/bs';

import './CurrentlyPlayingWidget.css';
import { transferPlayback } from '../util/spotifyAPI';

const track = {
	name: "",
	album: {
		images: [
			{ url: "" }
		]
	},
	artists: [
		{ name: "" }
	]
}

function PlayButton({ paused, player }) {
	const togglePause = () => {
		player.togglePlay();
	} 

	if (paused) return <BsPlayFill onClick={togglePause} />
	else return <BsPauseFill onClick={togglePause} />
}

// props 
function WebPlayback(props) {
	const isHidden = props.isHidden ?? true;
	const token = props.token;

	const [isPaused, setPaused] = useState(false);
	const [isActive, setActive] = useState(false);
	const [player, setPlayer] = useState(undefined);
	const [currTrack, setTrack] = useState(track);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(1);
	const [playbackDeviceId, setPlaybackDeviceId] = useState(null);

	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {

			const player = new window.Spotify.Player({
				name: 'Browser - Musical Jeopardy',
				getOAuthToken: cb => { cb(token); },
				volume: 1
			});

			setPlayer(player);

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				setPlaybackDeviceId(device_id);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', ( state => {
				console.log("state changed: ", state);

				if (!state) {
					console.log("user not playing music");
					return;
				}

				setTrack(state.track_window.currTrack);
				setPaused(state.paused);
				if (state.position) setProgress(state.position);
				if (state.duration) setDuration(state.duration);

				player.getCurrentState().then( state => { 
					(state) ? setActive(true) : setActive(false) 
				});
			}));

			player.connect();

		};
	}, []);

	// this might not be necessary either
	useEffect(() => {
		if (progress >= duration) return;
		if (isPaused) return;

		const intervalId = setInterval(() => {
			setProgress(progress + 1000)
		}, 1000);
	
		// clear interval on re-render to avoid memory leaks
		return () => clearInterval(intervalId);
	}, [progress, duration, isPaused]);

	// this might not be necessary and can be updated when state changes
	// useEffect( () => {
	// 	if (!currTrack) return;

	// 	// this might not exist, might have to use the previous method
	// 	if (currTrack.progress_ms) setProgress(val.progress_ms);
	// 	if (currTrack.item?.duration_ms) setDuration(val.item.duration_ms);
	// }, [currTrack])

	if (!isActive) { 
		return (
			<div className="container web-playback-testing">
				<div className="main-wrapper">
					<b> Currently playing on another device, select this device using the Spotify app! </b>
					<button
						onClick={ () => {
							transferPlayback(token, playbackDeviceId);
						}}
					>
						Click to change to this device
					</button>
					{/* TODO: add a button that swaps playback to this device */}
				</div>
			</div>
		);
	} else {
		return (
			<div className='currently-playing-widget web-playback-testing'>
				<span>{Math.floor(progress/1000)}s</span>
				<progress value={progress} max={duration}></progress>
				<span>{Math.floor(duration/1000)}s</span>
				<PlayButton
					paused={isPaused}
					player={player}
					token={token}
				/>
				{/* TODO: replace this with a replay button so it makes visual sense and you can listen to the song again */}
				<BsArrowClockwise onClick={() => player.seek(0)} />
			</div>
		);
	}
}

export default WebPlayback