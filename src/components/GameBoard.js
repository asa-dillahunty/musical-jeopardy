import { useEffect, useState } from 'react';
import './GameBoard.css';
// import { playTrack } from './spotifyAPI';

function GameBoard({ token }) {
	const [selectedCard, setSelectedCard] = useState({ });

	const getBoard = () => {
		const board = Array(6).fill().map( () => 
			Array(5).fill(undefined)
		);

		board[0][0] = "spotify:track:0aym2LBJBk9DAYuHHutrIl"; // hey jude, beatles
		board[0][1] = "spotify:track:4xdBrk0nFZaP54vvZj0yx7"; // hot to go, chappell roan
		board[0][2] = "spotify:track:61KoN6PlBhQD7sivCcf0hA"; // compensating, amine

		return board;
	}
	const board = getBoard();

	useEffect(() => {
		if (selectedCard.i === undefined) {
			return;
		}

		// start the music
		if (board[selectedCard.i][selectedCard.j]) {
			console.log(board[selectedCard.i][selectedCard.j]);
			// learn how to use this:
			// 		https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api
			// playTrack(board[selectedCard.i][selectedCard.j], token);
		}

	}, [selectedCard, board, token]);

	return (
		<div className="game-board">
			{board.map( (_val, i) =>
				<div className='game-col' key={`col-${i}`}>
					{board[i].map( (_val, j) => 
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
						<button onClick={() => setSelectedCard({})}>close</button>
					</div>
				</div>
			}
		</div>
	);
}

export default GameBoard;
