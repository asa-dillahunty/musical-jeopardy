import { useState } from 'react';
import GameBoard from './GameBoard';
import EditGame from './EditGame';
import GameSelector from './GameSelector';

function Menu ({ token, page, setPage }) {
	const [chosenGameID, setChosenGameID] = useState();

	switch(page) {
		case menuOptions.playSelected:
			return (
				<GameBoard
					setPage={setPage}
					gameID={chosenGameID}
					token={token}
				/>
			);
		case menuOptions.playSelection:
			return (
				<GameSelector
					setPage={setPage}
					setChosenGameID={setChosenGameID}
					editing={false}
				/>
			);
		case menuOptions.buildSelected:
			return (
				<EditGame
					setPage={setPage}
					gameID={chosenGameID}
					setChosenGameID={setChosenGameID}
					token={token}
				/>
			);
		case menuOptions.buildSelection:
			return (
				<GameSelector
					setPage={setPage}
					setChosenGameID={setChosenGameID}
					editing={true}
				/>
			);
		default: // menu
			return (
				<div className="menu-container">
					<button onClick={() => setPage(menuOptions.buildSelection)}>Build/Edit Board</button>
					<button onClick={() => setPage(menuOptions.playSelection)}>Play Game</button>
				</div>
			);
	}
	
}

export const menuOptions = {
	playSelected: "play selected",
	playSelection: "play selection",
	buildSelected: "build selected",
	buildSelection: "build selection",
	mainMenu: "menu"
}

export default Menu;
