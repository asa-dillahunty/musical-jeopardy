import { useEffect, useState } from 'react';
import './GameBoard.css';
import { useGame } from '../util/firebaseAPIs';
// import { playTrack } from './spotifyAPI';

function GameBoard({ token, gameID }) {
	const [selectedCard, setSelectedCard] = useState({ });
	const [board, setSelectedBoard] = useState();
	const { data: gameData, isLoading, isError } = useGame(gameID);
	
	useEffect(() => {
		if (isLoading) return;
		console.log(gameData);
		setSelectedBoard(gameData.boards[0]);
	}, [gameData, isLoading]);

	useEffect(() => {
		if (selectedCard.i === undefined) {
			return;
		}
		if (!board) return;
		console.log(board);

		// start the music
		if (board.grid[selectedCard.i][selectedCard.j]) {
			console.log(board.grid[selectedCard.i][selectedCard.j]);
			// learn how to use this:
			// 		https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api
			// playTrack(board[selectedCard.i][selectedCard.j], token);
		}

	}, [selectedCard, board, token]);

	if (isLoading) {
		return <p>Loading</p>
	}
	else if (isError) {
		return <p>Some error. Contact site owner.</p>
	}
	else if (!board) {
		return <p>Some error. Contact site owner.</p>
	}

	return (
		<div className="game-board">
			{Object.keys(board.grid).map( (_val, i) =>
				<div className='game-col' key={`col-${i}`}>
					{board.grid[i].map( (_val, j) => 
						<div 
							key={`cell-${i}-${j}`} 
							className='game-cell' 
							onClick={() => setSelectedCard({i,j})}
						>
							<p>{'$'+100*(j+1)}</p>
						</div>
					)}
				</div>
			)}
			{
				selectedCard.i !== undefined &&
				<div className='selected-card'>
					<div className="question-box">
						<p>Question {selectedCard.i} {selectedCard.j}</p>
						{ (board.grid[selectedCard.i][selectedCard.j] !== null) &&
							<>
								<p>{board.grid[selectedCard.i][selectedCard.j].name}</p>
								<p>{board.grid[selectedCard.i][selectedCard.j].artists && board.grid[selectedCard.i][selectedCard.j].artists[0].name }</p>
							</>
						}
						<button onClick={() => setSelectedCard({})}>close</button>
					</div>
				</div>
			}
		</div>
	);
}

export default GameBoard;
