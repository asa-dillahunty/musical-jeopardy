import './GameSelector.css';
import { menuOptions } from './Menu';
import { useDeleteGame, useGamesList } from '../util/firebaseAPIs';
import { FaRegTrashCan } from 'react-icons/fa6';

function GameSelector({ setPage, setChosenGameID, editing, userID }) {

	const { data: gameList, isLoading, isError } = useGamesList();
	const deleteGameMutation = useDeleteGame();

	const selectGame = (gameID) => {
		setChosenGameID(gameID);
		if (editing) setPage(menuOptions.buildSelected);
		else setPage(menuOptions.playSelected);
	}

	const handleDeleteGame = (e, gameID) => {
		e.stopPropagation();
		if (!window.confirm("Confirm Delete?")) return;
		deleteGameMutation.mutateAsync(gameID);
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
		<section className='selection-section'>
			<h2>Select a Game to {editing ? 'Edit' : 'Play'}!</h2>
			<button onClick={() => setPage(menuOptions.mainMenu)}>Back</button>
			<p>My Games</p>
			<ul className='game-selector-list'>
				{myGames.map( (game, index) => 
					<li key={index} onClick={() => selectGame(game.id)}>
						{game.name}
						{editing && <FaRegTrashCan onClick={(e) => handleDeleteGame(e, game.id)} /> }
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
		</section>
	);
}

export default GameSelector;
