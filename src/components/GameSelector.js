import './GameSelector.css';
import { menuOptions } from './Menu';
import { useDeleteGame, useGamesList } from '../util/firebaseAPIs';
import { FaRegTrashCan, FaWandMagicSparkles } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { queryGemini } from '../util/gemini';
import ClickBlocker from './ClickBlocker';
import { useState } from 'react';
import { HiOutlineSparkles } from 'react-icons/hi';
import NumberInput from './NumberInput';

function GameSelector({ setPage, setChosenGameID, editing, userID, token }) {
	const [askingGemini, setAskingGemini] = useState(false);
	const [openForm, setOpenForm] = useState(false);
	const [numBoards, setNumBoards] = useState(1);
	const [numCategories, setNumCategories] = useState(3);
	const [numRows, setNumRows] = useState(3);

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

	const askGemini = () => {
		// show loading
		setOpenForm(false);
		setAskingGemini(true);
		const options = {
			numBoards: numBoards,
			cols: numCategories,
			rows: numRows
		}
		
		queryGemini(token, userID, options).then((gameData) => {
			setAskingGemini(false);
			selectGame("");
		})
		.catch((e) => {
			alert("Encountered an issue. Please try again, but not too many times if it persists.");
			setAskingGemini(false);
			console.error(e.message);
		});
		// testFunc(token, userID).then((gameData) => {
		// 	selectGame("");
		// });
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
			<ClickBlocker block={openForm} custom >
				<div className='form-wrapper'>
					<div className='value-container'>
						<NumberInput
							label={"Number of Boards"}
							value={numBoards}
							setValue={setNumBoards}
							maxVal={3}
							minVal={1}
						/>
						<NumberInput
							label={"Number of Categories"}
							value={numCategories}
							setValue={setNumCategories}
							maxVal={6}
							minVal={3}
						/>
						<NumberInput
							label={"Number of Rows"}
							value={numRows}
							setValue={setNumRows}
							maxVal={5}
							minVal={3}
						/>
					</div>
					<button onClick={askGemini}>
						Submit
					</button>
					<button onClick={() => setOpenForm(false)}>
						Cancel
					</button>
				</div>
			</ClickBlocker>
			<ClickBlocker block={askingGemini} custom >
				<span className='loading-gemini-message'>
					<div className='sparkle-wrapper'>
						<HiOutlineSparkles />
					</div>
					<div className='text-wrapper'>
						<h3>Asking Gemini!</h3>
						<p>(It's not very smart)</p>
					</div>
				</span>
			</ClickBlocker>
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
			{editing && <>
				<button id="new-game-button" onClick={() => selectGame("")}>
					New Game
					<FaPlus />
				</button>
				<button id="ask-gemini-button" onClick={() => setOpenForm(true)}>
					Ask Gemini
					<FaWandMagicSparkles />
				</button>
			</>}
		</section>
	);
}

export default GameSelector;
