import React, { useState, useEffect } from 'react';

function WebPlayback({token}) {
	const [player, setPlayer] = useState(undefined);

	useEffect(() => {
		if (!token) return;
		else console.log(token);

		const script = document.createElement("script");
		script.src = "https://sdk.scdn.co/spotify-player.js";
		script.async = true;

		document.body.appendChild(script);
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: 'Web Playback SDK',
				getOAuthToken: cb => { cb( token ); },
				volume: 0.5
			});

			setPlayer(player);
			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
			});
			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});
			player.connect();
		};
	}, [token]);
	return (
		<>
			<div className="container">
				<div className="main-wrapper">
				</div>
			</div>
		</>
	);
}

export default WebPlayback