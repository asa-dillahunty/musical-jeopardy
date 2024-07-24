import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import WebPlayback from './components/WebPlayback';
import { getTokenFromUrl } from './util/spotifyAPI';
import Menu, { menuOptions } from './components/Menu';
import { QueryClient, QueryClientProvider } from 'react-query';

function App() {
	const [token, setToken] = useState('');
	const [page, setPage] = useState('menu');

	useEffect(() => {
		const accessToken = getTokenFromUrl();
		if (accessToken) setToken(accessToken);
	}, []);
	
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<div className="App">
				<header className="App-header">
					{page !== menuOptions.mainMenu && <button onClick={()=>setPage(menuOptions.mainMenu)}>Exit to Main Menu</button> }
					MUSICAL JEOPARDY
				</header>
				<main>
					{ (token === '') ? <Login /> : <Menu token={token} page={page} setPage={setPage} /> }
					{/* <WebPlayback token={token} /> */}
				</main>
			</div>
		</QueryClientProvider>
	);
}

export default App;
