import { useEffect, useState } from 'react';
import './GameBoard.css';
import NumberInput from './NumberInput';
import { AiOutlineSearch } from 'react-icons/ai';
import { currentlyPlaying, playTrack, searchTracks } from '../util/spotifyAPI';

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

/*
if we are editing, we want here to be a modal with 
	search that takes up the whole screen
if we are playing the game, we want here to be card 
	that fills the entire board and contains a 
	web playback tool, with some key items hidden, 
	as well as eventually players, their scores, etc.
*/
function PlayCard({ token, setSelectedCard, val }) {
	const [progress, setProgress] = useState(0);
	// start the music if not editing
	const playSong = () => {
		// learn how to use this:
		// 		https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api
		playTrack(val.uri, token);
	}

	const refreshDuration = () => {
		currentlyPlaying(token).then((val) => {
			setProgress(val.progress_ms);
		});
	}

	return (
		<div className='selected-card'>
			<div className="question-box">
				{ val &&
					<>
						<p>{ val.name }</p>
						<p>{ val.artists[0].name }</p>
						<p>{progress}</p>
					</>
				}
				<button onClick={() => setSelectedCard({})}>close</button>
				<button onClick={playSong}>play song</button>
				<button onClick={refreshDuration}>refresh</button>
			</div>
		</div>
	);
}

function EditCard({ token, selectTrack, setSelectedCard, val }) {
	const [queryVal, setQueryVal] = useState("");
	const [searchResults, setSearchResults] = useState([]);

	const onEnter = (e) => {
		if (e.key === 'Enter') {
			performQuery();
		}
	}

	const performQuery = () => {
		console.log(queryVal);
		searchTracks(queryVal, token).then((results) => {
			setSearchResults(results);
			console.log(results);
		});
	}

	return (
	// selectedCard.i !== undefined &&
		<div className='selected-card'>
			<div className="question-box">
				<input
					onChange={(e) => setQueryVal(e.target.value)}
					value={queryVal}
					onKeyDown={onEnter}
				/>
				<AiOutlineSearch onClick={performQuery}/>
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
				{ val && 
					<p>{ val.name }</p>
				}
				<button onClick={() => setSelectedCard({})}>close</button>
			</div>
		</div>
	);
}

function BoardCell({ i, j, val, setVal, multiplier, header, editing, setSelectedCard }) {
	if (header) {
		return (
			<div className='game-cell category'>
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
		if (!selectedCard.i) return; // no selected card
		// should we do something when a card is selected?
	}, [selectedCard]);

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
				{ // how do we display the selected card?
					(selectedCard.i === undefined) ? <></> : (editing ? 
					<EditCard
						token={token}
						selectTrack={selectTrack}
						setSelectedCard={setSelectedCard}
						val={board.grid[selectedCard.i][selectedCard.j]}
					/> :
					<PlayCard 
						token={token}
						setSelectedCard={setSelectedCard}
						val={board.grid[selectedCard.i][selectedCard.j]}
					/>)
				}
				
			</div>
		</div>
	);
}

export default GameBoard;