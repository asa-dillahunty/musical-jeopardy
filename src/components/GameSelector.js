import './GameSelector.css';
import { menuOptions } from './Menu';
import { useGamesList } from '../util/firebaseAPIs';

function GameSelector({ setPage, setChosenGameID, editing }) {

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

	return (
		<div>
			<h2>Select a Game to {editing ? 'Edit' : 'Play'}!</h2>
			<button onClick={() => setPage(menuOptions.mainMenu)}>Back</button>
			<ul className='game-selector-list'>
				{gameList.map( (game, index) => 
					<li key={index} onClick={() => selectGame(game.id)}>
						{game.name}
					</li>
				)}
				{editing && <li onClick={() => selectGame("")}>New Game (+)</li>}
			</ul>
		</div>
	);
}

export default GameSelector;
