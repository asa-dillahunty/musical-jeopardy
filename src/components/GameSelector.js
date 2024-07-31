import './GameSelector.css';
import { menuOptions } from './Menu';
import { useGamesList } from '../util/firebaseAPIs';

function GameSelector({ setPage, setChosenGameID, editing, userID }) {

	const { data: gameList, isLoading, isError } = useGamesList();

	const selectGame = (gameID) => {
		setChosenGameID(gameID);
		if (editing) setPage(menuOptions.buildSelected);
		else setPage(menuOptions.playSelected);
	}

	if (isLoading) {
		return <p>Loading</p>
	}
	else if (isError) {
		return <p>Some error. Contact site owner.</p>
	}

	const myGames = gameList.filter((game) => game.userID === userID);
	const otherGames = gameList.filter((game) => game.userID !== userID);

	return (
		<div>
			<h2>Select a Game to {editing ? 'Edit' : 'Play'}!</h2>
			<button onClick={() => setPage(menuOptions.mainMenu)}>Back</button>
			<p>My Games</p>
			<ul className='game-selector-list'>
				{myGames.map( (game, index) => 
					<li key={index} onClick={() => selectGame(game.id)}>
						{game.name}
					</li>
				)}
			</ul>
			<p>Public Games</p>
			<ul className='game-selector-list'>
				{otherGames.map( (game, index) => 
					<li key={index} onClick={() => selectGame(game.id)}>
						{game.name}
					</li>
				)}
			</ul>
			{editing &&
				<button id="new-game-button" onClick={() => selectGame("")}>
					New Game (+)
				</button>
			}
		</div>
	);
}

export default GameSelector;
