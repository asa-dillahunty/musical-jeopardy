import React from 'react';
import { spotifyLogin } from '../util/spotifyAPI';

function Login() {
	return (
		<div className="App">
			<header className="App-header">
				<button className="btn-spotify" onClick={spotifyLogin}>
					Login with Spotify 
				</button>
			</header>
		</div>
	);
}

export default Login;
