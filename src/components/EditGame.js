import { useEffect, useState } from 'react';
import './EditBoard.css';
import NumberInput from './NumberInput';
import { AiOutlineSearch } from 'react-icons/ai';
import { searchTracks } from './spotifyAPI';
import EditBoard from './EditBoard';

// what's the game object look like?
/*
	Game = {
		id: string,
		name: string,
        numBoards: int,
		boards: Boards[],
	}
*/


// what's the board object look like?
/* 
	Board = {
		cols: int,
		rows: int,
		grid: string[cols][rows] = trackUri,

		multiplier: int,
		dailyDoubles: int,
	}
*/

function getGame(gameID) {
	if (!gameID) {
		// new board
		const boardList = Array(3)
			.fill(undefined)
			.map((_val,index) => createNewBoard(index));

		// generate 3 boards
		// boardList.map((val,index) => val = createNewBoard(index));

		const newGame = {
			id:"Big Mode",
			name: "First Game!",
			numBoards: 2,
			boards: boardList,
		};
		return newGame;
	}
}

function createNewBoard(index) {
	// new board
	const boardGrid = createGrid();
	// generate an ID
	const newBoard = {
		cols: 6,
		rows: 5,
		grid: boardGrid,
		multiplier: index + 1,
		dailyDoubles: index + 1,
	};

	return newBoard;
}

function createGrid(oldGrid) {
	const boardGrid = Array(6).fill().map( () => 
		Array(6).fill(undefined)
	);
	
	boardGrid[0][0] = "Sultans in the Sky";
	boardGrid[1][0] = "Grey Beards are Coming";
	boardGrid[2][0] = "Chungus";
	boardGrid[3][0] = "Emily Bell, Or Ray";
	boardGrid[4][0] = "Meet Your Creatures";
	boardGrid[5][0] = "Alphabetically";

	if (!oldGrid) return boardGrid;
	// else fill with old values
	for (let i=0;i<boardGrid.length;i++) {
		for (let j=0;j<boardGrid[i].length;j++) {
			boardGrid[i][j] = oldGrid[i][j];
		}
	}

	return boardGrid;
}

function EditGame({ gameID, token }) {
	const [game, setGame] = useState();
	const [numBoards, setNumBoards] = useState();
	const [selectedBoard, setSelectedBoard] = useState(null);

	const updateBoard = () => {
		setGame( JSON.parse(JSON.stringify(game)) );
	}

	useEffect(() => {
		const newGame = getGame(gameID);
        setGame(newGame);
		setNumBoards(newGame.numBoards);
	}, [gameID, setGame, setNumBoards])

    if (!game) return;
	if (selectedBoard !== null) {
		return (
			<EditBoard
				board={game.boards[selectedBoard]}
				preview={false}
				token={token}
				updateBoard={updateBoard}
				setSelectedBoard={setSelectedBoard}
			/>
		)
	}
	return (
		<div className='edit-game'>
			<div className='value-container'>
				<NumberInput
					label={"Number of Boards"}
					value={numBoards}
					setValue={setNumBoards}
					maxVal={3}
					minVal={1}
				/>
			</div>

			<div className="game-board-list">
				{ game.boards.map( (val, index) => 
                    ( index < numBoards && 
						<div key={index} onClick={() => setSelectedBoard(index) }>
							<EditBoard 
								board={game.boards[index]}
								preview={true}
							/>
						</div>
					)
                ) }
			</div>
		</div>
	);
}

export default EditGame;