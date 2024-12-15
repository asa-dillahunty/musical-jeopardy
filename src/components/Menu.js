import { useState } from 'react';
import EditGame from './EditGame';
import GameSelector from './GameSelector';
import PlayGame from './PlayGame';

function Menu ({ token, page, setPage, userID }) {
	const [chosenGameID, setChosenGameID] = useState();

	switch(page) {
		case menuOptions.playSelected:
			return (
				<PlayGame
					setPage={setPage}
					gameID={chosenGameID}
					token={token}
					setChosenGameID={setChosenGameID}
				/>
			);
		case menuOptions.playSelection:
			return (
				<GameSelector
					setPage={setPage}
					userID={userID}
					setChosenGameID={setChosenGameID}
					editing={false}
				/>
			);
		case menuOptions.buildSelected:
			return (
				<EditGame
					setPage={setPage}
					userID={userID}
					gameID={chosenGameID}
					setChosenGameID={setChosenGameID}
					token={token}
				/>
			);
		case menuOptions.buildSelection:
			return (
				<GameSelector
					setPage={setPage}
					userID={userID}
					setChosenGameID={setChosenGameID}
					editing={true}
					token={token}
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
