import { FaTrophy } from 'react-icons/fa6';
import { numPlayersSignal, playersSignal } from '../util/session';
import './ScoreBoard.css';

export function ScoreBoard() {
	const numPlayers = numPlayersSignal.value;
	const players = playersSignal.value;

	const scoredPlayers = players.filter(player => player.index < numPlayers).sort((a, b) => b.score - a.score);
	console.log(scoredPlayers);

	// get all the players
	// sort them by score
	// display them

	return (
		<section className='score-board'>
			<ol>
				{ scoredPlayers.map((player, index) => {
					if (index < 3) {
						return <li>
							<FaTrophy />
							<div>{index + 1}.</div>
							<div>{player.name}</div>
							<div>{player.score}</div>
						</li>
					}
					else {
						return <li>
							<div>{index + 1}.</div>
							<div>{player.name}</div>
							<div>{player.score}</div>
						</li>
					}
				})}
			</ol>
		</section>
	);
}