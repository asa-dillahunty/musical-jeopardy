import { useEffect, useState } from 'react';
import './EditBoard.css';
import NumberInput from './NumberInput';
import { AiOutlineSearch } from 'react-icons/ai';
import { searchTracks } from './spotifyAPI';

// what's the game object look like?
/*
	Game = {
		id: string,
		name: string,
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

function getBoard(boardID) {
	if (!boardID) {
		// new board
		const boardGrid = createGrid();

		const newBoard = {
			cols: 6,
			rows: 5,
			grid: boardGrid,
			multiplier: 1,
			dailyDoubles: 1,
		};

		return newBoard;
	}
}

function createGrid(oldGrid) {
	const boardGrid = Array(6).fill().map( () => 
		Array(6).fill(undefined)
	);
	
	boardGrid[0][0] = "Sultans in the Sky";
	boardGrid[1][0] = "Grey Beards are Coming";
	boardGrid[2][0] = "Chungus";
	boardGrid[3][0] = "Emily Ray, Or Bell";
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

function EditBoard({ boardID, token, preview }) {
	const [selectedCard, setSelectedCard] = useState({ });
	const [board, setBoard] = useState();
	const [cols, setCols] = useState();
	const [rows, setRows] = useState();
	const [multiplier, setMultiplier] = useState();
	const [dailyDoubles, setDailyDoubles] = useState();

	const [queryVal, setQueryVal] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const performQuery = () => {
		console.log(queryVal);
		searchTracks(queryVal, token).then((results) => {
			setSearchResults(results);
			console.log(results);
		})
	}

	const changeBoardGridValue = (i, j, val) => {
		const newBoard = {...board};
		const newGrid = createGrid(board.grid);

		newGrid[i][j] = val;
		newBoard.grid = newGrid;
		setBoard(newBoard);
	}

	const selectTrack = (track) => {
		// gotta reset the board
		console.log(track.uri);
		changeBoardGridValue(selectedCard.i, selectedCard.j, track.uri);
	}

	const setCategoryValue = (col, val) => {
		changeBoardGridValue(col, 0, val);
	}

	useEffect(() => {
		const newBoard = getBoard(boardID);
		setBoard(newBoard);
		setCols(newBoard.cols);
		setRows(newBoard.rows);
		setMultiplier(newBoard.multiplier);
		setDailyDoubles(newBoard.dailyDoubles);
		
	}, [boardID, setBoard, setCols, setRows,])

	useEffect(() => {
		if (selectedCard.i === undefined) {
			setSearchResults(null);
			setQueryVal("");
			return;
		}

		// start the music
		if (board.grid[selectedCard.i][selectedCard.j]) {
			console.log(board.grid[selectedCard.i][selectedCard.j]);
			// learn how to use this:
			// 		https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api
			// playTrack(board.grid[selectedCard.i][selectedCard.j], token);
		}

	}, [selectedCard, board, setSearchResults]);

	console.log(preview);
	if (preview) {
		return (
			<div className='edit-board'>
				<div className="game-board">
					{board && board.grid.map( (_val, i) =>
						i < cols &&
						<div className='game-col' key={`col-${i}`}>
							{board.grid[i] && board.grid[i].map( (_val, j) => 
								j < 1 && // just display categories for preview
								<div key={`cell-${i}-${j}`} className='game-cell category'>
									<p>{board.grid[i][j]}</p>
								</div> 
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
	return (
		<div className='edit-board'>
			<div className='value-container'>
				<NumberInput
					label={"Columns"}
					value={cols}
					setValue={setCols}
					maxVal={6}
					minVal={3}
				/>
				<NumberInput
					label={"Rows"}
					value={rows}
					setValue={setRows} 
					maxVal={5}
					minVal={3}
				/>
				<NumberInput
					label={"Multiplier"}
					value={multiplier}
					setValue={setMultiplier} 
					maxVal={3}
					minVal={1}
				/>
				<NumberInput
					label={"Daily Doubles"}
					value={dailyDoubles}
					setValue={setDailyDoubles} 
					maxVal={3}
					minVal={1}
				/>
			</div>

			<div className="game-board">
				{board && board.grid.map( (_val, i) =>
					i < cols &&
					<div className='game-col' key={`col-${i}`}>
						{board.grid[i] && board.grid[i].map( (_val, j) => 
							j <= rows && // j === 0 is categories, add 1 to adjust for categories
							( j === 0 ?
								<div key={`cell-${i}-${j}`} className='game-cell'>
									<textarea
										placeholder='Category'
										onChange={(e) => changeBoardGridValue(i, 0, e.target.value)}
										value={board.grid[i][j]}
									/>
								</div> 
							:
								<div 
									key={`cell-${i}-${j}`} 
									className='game-cell' 
									onClick={() => setSelectedCard({i,j})}
								>
									<p>{'$'+100*(j)*multiplier}</p>
								</div>
							)
						)}
					</div>
				)}
				{
					selectedCard.i !== undefined &&
					<div className='selected-card'>
						<div className="question-box">
							<input onChange={(e) => setQueryVal(e.target.value)} value={queryVal} /><AiOutlineSearch onClick={performQuery}/>
							<div className='search-box'>
								{ searchResults && searchResults.map( (val, index) => 
									<p key={index} onClick={() => selectTrack(val)}>
										{ val.name }
									</p>
								) }
							</div>
							{ board.grid[selectedCard.i][selectedCard.j] && 
								<p>{board.grid[selectedCard.i][selectedCard.j]}</p>
							}
							<button onClick={() => setSelectedCard({})}>close</button>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default EditBoard;