import './App.css';
import GameBoard from './components/GameBoard';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import WebPlayback from './components/WebPlayback';
import { getTokenFromUrl } from './components/spotifyAPI';

function App() {
	const [token, setToken] = useState('');

	useEffect(() => {
		const accessToken = getTokenFromUrl();
		if (accessToken) setToken(accessToken);
	}, []);
	
	return (
		<div className="App">
			<header className="App-header">
				MUSICAL JEOPARDY
			</header>
			<main>
				{ (token === '') ? <Login /> : <GameBoard token={token} /> }
				<WebPlayback token={token} />
			</main>
		</div>
	);
}

export default App;
