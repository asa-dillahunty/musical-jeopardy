import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import { getTokenFromUrl, getUserId } from './util/spotifyAPI';
import Menu, { menuOptions } from './components/Menu';
import { QueryClient, QueryClientProvider } from 'react-query';
import { markEvent } from './util/firebaseAPIs';

function App() {
	const [token, setToken] = useState('');
	const [userID, setUserID] = useState();
	const [page, setPage] = useState('menu');

	useEffect(() => {
		const accessToken = getTokenFromUrl();
		if (!accessToken) return;
		setToken(accessToken);
		getUserId(accessToken).then((id) => {
			setUserID(id);
			markEvent("log_into_spotify", {userId: id});
		});
	}, []);
	
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<div className="App">
				<header className="App-header">
					{page !== menuOptions.mainMenu && <button onClick={()=>setPage(menuOptions.mainMenu)}>Exit to Main Menu</button> }
					<button onClick={() => localStorage.clear()}>clear local storage</button>
					MUSICAL JEOPARDY
				</header>
				<main>
					{ (token === '') ? 
						<Login /> : 
						<Menu
							token={token}
							userID={userID}
							page={page}
							setPage={setPage}
						/> 
					}
					{/* <WebPlayback token={token} /> */}
				</main>
			</div>
		</QueryClientProvider>
	);
}

export default App;
