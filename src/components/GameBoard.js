import { useCallback, useEffect, useState } from 'react';
import './GameBoard.css';
import NumberInput from './NumberInput';
import { AiFillCloseCircle, AiOutlineSearch } from 'react-icons/ai';
import { playTrack, searchTracks } from '../util/spotifyAPI';
import CurrentlyPlayingWidget from './CurrentlyPlayingWidget';
import { FaEyeSlash } from 'react-icons/fa';
import { SpotlightBackGround } from '../util/stolen';
import { GiDoubleQuaver, GiRollingDices } from 'react-icons/gi';
import { PlayerContainer } from './PlayGame';
import { playersSignal, updatePlayerScore } from '../util/session';

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
function PlayCard(
		{ 
			token, setSelectedCard, val, refreshWidget, 
			revealCard, isDailyDouble, selectedPlayer, setSelectedPlayer,
			dailyDoubleWager, setDailyDoubleWager
		}) {
	const [isAnswerVisible, setIsAnswerVisible] = useState(false);
	const [startedPlaying, setStartedPlaying] = useState(false);
	const [placingWager, setPlacingWager] = useState(isDailyDouble);

	const showAnswer = () => {
		revealCard();
		setIsAnswerVisible(true);
	}

	// start the music if not editing
	const playSong = () => {
		if (!val) return;
		if (startedPlaying) return;
		// maybe learn how to use this:
		// 		https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api
		playTrack(val.uri, token).then(() => {
			// we also want to trigger a refresh for the curr-playing-widget
			// maybe on a delay?
			// This is done because apparently Spotify is too slow
			setTimeout(refreshWidget, 1000);
		});
		setStartedPlaying(true);
	}

	const finalizeWager = () => {
		// playSong();
		setPlacingWager(false)
	}

	const winWager = () => {
		updatePlayerScore(selectedPlayer.index, playersSignal.value[selectedPlayer.index].score + dailyDoubleWager);
		setSelectedCard({});
	}

	const loseWager = () => {
		updatePlayerScore(selectedPlayer.index, playersSignal.value[selectedPlayer.index].score - dailyDoubleWager);
		setSelectedCard({});
	}

	useEffect(() => {
		if (!isDailyDouble) playSong();
	}, []);

	if (!val) return (
		<div className='selected-card'>
			<div className="question-box">
				<p className='empty-message'>Song not selected for game</p>
				<AiFillCloseCircle className='close-button' onClick={() => setSelectedCard({})} />
			</div>
		</div>
	);

	const albImg = val.album.images[0];
	let artistList = val.artists[0].name;
	for (let i=1;i<val.artists.length;i++) {
		artistList += `, ${val.artists[i].name}`;
	}

	const currentScore = selectedPlayer ? playersSignal.value[selectedPlayer.index].score : 0;
	if (placingWager) {
		return (
			<div className="selected-card">
				<div className='daily-double-card'>
					<p>it's the daily double! place a wager!</p>
					{ selectedPlayer ? <p>{selectedPlayer.name}</p> : <p>Select a player to wager in the sidebar!</p> }
					{ selectedPlayer && <>
						<NumberInput
							label="wager $"
							value={dailyDoubleWager}
							setValue={setDailyDoubleWager}
							maxVal={currentScore > 500 ? currentScore : 500}
							minVal={0}
						/>
						<button onClick={finalizeWager}>Finalized wager</button>
					</>}
				</div>
			</div>
		);
	}

	const nameOfClass = isDailyDouble ? 'selected-card daily-double' : 'selected-card';
	return (
		<div className={nameOfClass}>
			<div className="question-box">
				<SpotlightBackGround />
				{ val &&
					<div className={`answer-box ${isAnswerVisible ? "" : "hidden"}`} >
						<div className="song-card">
							<div className='image-container'>
								<img
									height={albImg.height}
									width={albImg.width}
									src={albImg.url}
									alt="album art"
								/>
							</div>
							<div className='text-container'>
								<p>{ val.name }</p>
								<p>{ artistList }</p>
							</div>
						</div>
						<div className="background-image"></div>
						{isDailyDouble && 
							<div className='temp-button-name'>
								<button onClick={winWager}>success</button><button onClick={loseWager}>fail</button>
							</div>}
					</div>
				}
				{ !isAnswerVisible && <FaEyeSlash className='reveal-button' onClick={showAnswer}/> }
				<AiFillCloseCircle className='close-button' onClick={() => setSelectedCard({})} />
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
		<div className='selected-card editing'>
			<div className="question-box">
				<div className="search-bar">
					<input
						onChange={(e) => setQueryVal(e.target.value)}
						value={queryVal}
						onKeyDown={onEnter}
					/>
					<AiOutlineSearch onClick={performQuery}/>
				</div>
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

function BoardCell({ i, j, val, setVal, multiplier, header, editing, setSelectedCard, revealed, isDailyDouble }) {
	if (header) {
		if (editing) {
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
			return (
				<div className='game-cell category'>
					<p>{val}</p>
				</div>
			);
		}
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
						{isDailyDouble && <GiDoubleQuaver />}
					</div>
				:
					<div
						className='game-cell' 
						onClick={() => setSelectedCard({i,j})}
					>
						<p>{'$'+100*(j)*(multiplier)}</p>
						{isDailyDouble && <GiDoubleQuaver />}
					</div>
				)
			);
		}
		else {
			if (revealed) return (
				<div
					className='game-cell revealed' 
					onClick={() => setSelectedCard({i,j})}
				>
					<p>{val.name}</p>
				</div>
			);
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

function BoardValueNumberInputs({ cols, setCols, rows, setRows, multiplier, setMultiplier, dailyDoubles, setDailyDoubles, randomizeDailyDoublePositions }) {
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
			<GiRollingDices onClick={randomizeDailyDoublePositions}/>
		</div>
	)
}

function GameBoard({ board, token, preview, editing, updateBoard, setSelectedBoard }) {
	const [selectedCard, setSelectedCard] = useState({ });
	const [widgetNeedsRefresh, setWidgetNeedsRefresh] = useState(false);
	const [revealedCards, setRevealedCards] = useState({});
	const [selectedPlayer, setSelectedPlayer] = useState(null);
	const [dailyDoubleWager, setDailyDoubleWager] = useState(500);

	const updateRevealed = () => {
		setRevealedCards( JSON.parse(JSON.stringify(revealedCards)) );
	}

	const revealCard = (i,j) => {
		if (!revealedCards[i]) revealedCards[i] = {};
		revealedCards[i][j] = true;
		updateRevealed();
	}

	const getRevealed = (i,j) => {
		if (!revealedCards[i]) return false;
		else return revealedCards[i][j] === true;
	}

	const refreshWidget = () => {
		setWidgetNeedsRefresh(!widgetNeedsRefresh);
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

	const randomizeDailyDoublePositions = () => {
		if (!board.dailyDoublePositions) board.dailyDoublePositions = [];
		for (let index=0; index<board.dailyDoubles; index++) {
			// get i, get j
			let i = Math.floor(Math.random() * board.rows);
			let j = Math.floor(Math.random() * board.cols) + 1; // plus one to avoid categories
			if (isDailyDouble(i, j)) {
				// if already a daily double, try again
				index -= 1;
				continue;
			}
			 
			if (board.dailyDoublePositions[index]) 
				board.dailyDoublePositions[index] = { i, j };
			else 
				board.dailyDoublePositions.push({ i, j });
		}
		updateBoard();
	}

	const isDailyDouble = (i, j) => {
		if (!board) return false
		if (!board.dailyDoublePositions) return false;
		i = parseInt(i);
		// rows are strings because they are keys

		for (let index=0; index < board.dailyDoubles; index++) {
			const curr = board.dailyDoublePositions[index];
			if (curr === undefined) break;
			if (curr.i === i && curr.j === j) return true;
		}
		return false;
	}

	const setCategoryValue = (col, val) => {
		board.grid[col][0] = val;
		updateBoard();
	}

	useEffect(() => {
		if (!selectedCard.i) return; // no selected card
		// should we do something when a card is selected?
	}, [selectedCard]);

	const onClickPlayerFunc = (player, prevStatus) => {
		const calcScore = Number.parseInt( selectedCard.j ) * board.multiplier * 100;

		if (prevStatus === 'neutral') {
			// it was a success, add the score
			updatePlayerScore(player.index, playersSignal.value[player.index].score + calcScore)
		}
		else if (prevStatus === 'success') {
			// it was a fail, but we just added ^. Subtract twice
			updatePlayerScore(player.index, playersSignal.value[player.index].score - 2*calcScore)
		}
		else if (prevStatus === 'fail') {
			// was a fail, but should be neutral, just add it back
			updatePlayerScore(player.index, playersSignal.value[player.index].score + calcScore)
		}
		
	}

	const onClickPlayer = selectedCard.i ? onClickPlayerFunc : undefined;
	const selectedIsDailyDouble = isDailyDouble(selectedCard.i, selectedCard.j);

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
								<BoardCell 
									key={`cell-${i}-${j}`}
									i={i}
									j={j}
									val={board.grid[i][j]}
									header={j === 0}
									editing={false}
								/>
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
					randomizeDailyDoublePositions={randomizeDailyDoublePositions}
				/>
			}
			<div className='game-board-and-sidebar'>
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
									revealed={getRevealed(i,j)}
									isDailyDouble={isDailyDouble(i,j)}
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
							refreshWidget={refreshWidget}
							revealCard={() => revealCard(selectedCard.i,selectedCard.j)}
							isDailyDouble={selectedIsDailyDouble}
							selectedPlayer={selectedPlayer}
							setSelectedPlayer={setSelectedPlayer}
							dailyDoubleWager={dailyDoubleWager}
							setDailyDoubleWager={setDailyDoubleWager}
						/>)
					}
				</div>
				{ !editing && 
					<PlayerContainer
						isSidebar
						onClickPlayer={selectedIsDailyDouble ? setSelectedPlayer : onClickPlayer}
					/>
				}
			</div>
			{!editing && <>
				<CurrentlyPlayingWidget
					token={token}
					widgetNeedsRefresh={widgetNeedsRefresh}
					toggleRefresh={refreshWidget}
				/>
				<PlayerContainer isPlaying/>
			</> }
		</div>
	);
}

export default GameBoard;