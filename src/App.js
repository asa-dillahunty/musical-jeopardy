import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import WebPlayback from './components/WebPlayback';
import { getTokenFromUrl } from './components/spotifyAPI';
import Menu from './components/Menu';

function App() {
	const [token, setToken] = useState('');
	const [page, setPage] = useState('menu');

	useEffect(() => {
		const accessToken = getTokenFromUrl();
		if (accessToken) setToken(accessToken);
	}, []);
	
	return (
		<div className="App">
			<header className="App-header">
				{page !== 'menu' && <button onClick={()=>setPage('menu')}>Back</button> }
				MUSICAL JEOPARDY
			</header>
			<main>
				{ (token === '') ? <Login /> : <Menu token={token} page={page} setPage={setPage} /> }
				{/* <WebPlayback token={token} /> */}
			</main>
		</div>
	);
}

export default App;
