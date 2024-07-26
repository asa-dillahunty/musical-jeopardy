import { useEffect, useState } from 'react';
import './GameBoard.css';
import NumberInput from './NumberInput';
import { AiOutlineSearch } from 'react-icons/ai';
import { searchTracks } from '../util/spotifyAPI';

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
		id: string,
		name: string,
		cols: int,
		rows: int,
		grid: string[cols][rows] = trackUri,

		multiplier: int,
		dailyDoubles: int,
	}
*/

function BoardCell({ i, j, val, setVal, multiplier, header, editing, setSelectedCard }) {
	if (header) {
		return (
			<div className='game-cell'>
				<textarea
					placeholder='Category'
					onChange={(e) => setVal(i, e.target.value)}
					value={val}
					disabled={!editing}
				/>
			</div> 
		);
	}
	else {
		if (editing) {
			return (
				(val ? 
					<div
						className='game-cell populated' 
						onClick={() => setSelectedCard({i,j})}
					>
						<p>{'$'+100*(j)*(multiplier)}</p>
						<p>{val.name}</p>
						<p>{val.artists[0].name}</p>
					</div>
				:
					<div
						className='game-cell' 
						onClick={() => setSelectedCard({i,j})}
					>
						<p>{'$'+100*(j)*(multiplier)}</p>
					</div>
				)
			);
		}
		else {
			return (
				<div
					className='game-cell' 
					onClick={() => setSelectedCard({i,j})}
				>
					<p>{'$'+100*(j)*(multiplier)}</p>
				</div>
			);
		}
	}	
}

function BoardValueNumberInputs({ cols, setCols, rows, setRows, multiplier, setMultiplier, dailyDoubles, setDailyDoubles }) {
	return (
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
	)
}

function GameBoard({ board, token, preview, editing, updateBoard, setSelectedBoard }) {
	const [selectedCard, setSelectedCard] = useState({ });

	const [queryVal, setQueryVal] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const performQuery = () => {
		console.log(queryVal);
		searchTracks(queryVal, token).then((results) => {
			setSearchResults(results);
			console.log(results);
		})
	}

	const selectTrack = (track) => {
		board.grid[selectedCard.i][selectedCard.j] = track;
		updateBoard();
		// gotta reset the board
		console.log(track.uri);
	}

	const setCols = (val) => {
		board.cols = val;
		updateBoard();
	}

	const setRows = (val) => {
		board.rows = val;
		updateBoard();
	}

	const setMultiplier = (val) => {
		board.multiplier = val;
		updateBoard();
	}
	const setDailyDoubles = (val) => {
		board.dailyDoubles = val;
		updateBoard();
	}

	const setCategoryValue = (col, val) => {
		board.grid[col][0] = val;
		updateBoard();
	}

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

	// console.log(preview,board);
	if (!board) return; // maybe return a skeleton
	if (preview) {
		return (
			<div className='edit-board preview'>
				<div className="game-board">
					{board && Object.keys(board.grid).map( (i) =>
						i < board.cols &&
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
			<div>
				<button onClick={() => setSelectedBoard(null)}>Done</button>
			</div>
			{ editing &&
				<BoardValueNumberInputs 
					cols={board.cols}
					setCols={setCols}
					rows={board.rows}
					setRows={setRows}
					multiplier={board.multiplier}
					setMultiplier={setMultiplier}
					dailyDoubles={board.dailyDoubles}
					setDailyDoubles={setDailyDoubles}
				/>
			}
			<div className="game-board">
				{board && Object.keys(board.grid).map( (i) =>
					i < board.cols &&
					<div className='game-col' key={`col-${i}`}>
						{board.grid[i] && board.grid[i].map( (_val, j) => 
							j <= board.rows && // j === 0 is categories, add 1 to adjust for categories
							<BoardCell 
								key={`cell-${i}-${j}`}
								i={i}
								j={j}
								val={board.grid[i][j]}
								setVal={setCategoryValue}
								multiplier={board.multiplier}
								header={j === 0}
								editing={editing}
								setSelectedCard={setSelectedCard}
							/>
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
									<div 
										className="search-item"
										onClick={() => selectTrack(val)}
										key={index}
									>
										<p> { val.name } </p>
										<p> { val.artists[0].name } </p>
									</div>
								) }
							</div>
							{ board.grid[selectedCard.i][selectedCard.j] && 
								<p>{board.grid[selectedCard.i][selectedCard.j].name}</p>
							}
							<button onClick={() => setSelectedCard({})}>close</button>
						</div>
					</div>
				}
			</div>
		</div>
	);
}

export default GameBoard;