import { useEffect, useState } from 'react';
import NumberInput from './NumberInput';
import GameBoard from './GameBoard';
import { useCreateGame, useGame, useUpdateGame } from '../util/firebaseAPIs';

function PlayGame({ gameID, token, setChosenGameID }) {
	const [selectedBoard, setSelectedBoard] = useState(null);
	const { data: gameData, isLoading, isError } = useGame(gameID);

	useEffect(() => {
		if (!isLoading) {
			setSelectedBoard(0);
		}
	}, [isLoading]);

	if (isLoading) {
		return <p>Loading</p>
	}
	else if (isError) {
		return <p>Some error. Contact site owner.</p>
	}
	else if (!gameData) {
		return <p>Some error. Contact site owner.</p>
	}

	if (selectedBoard !== null) {
		return (
			<GameBoard
				board={gameData.boards[selectedBoard]}
				preview={false}
				token={token}
				setSelectedBoard={setSelectedBoard}
				editing={false}
			/>
		)
	}
	return (
		<div className='edit-game'>
			<div>
				<p>{gameData.name}</p>
			</div>

			<div className="game-board-list">
				{ gameData.boards.map( (val, index) => 
					( index < gameData.numBoards && 
						<div key={index} onClick={() => setSelectedBoard(index) }>
							<GameBoard 
								board={val}
								preview={true}
							/>
						</div>
					)
				) }
			</div>
		</div>
	);
}

export default PlayGame;