import './FinalJeopardy.css';
import React, { useEffect, useState } from 'react';
import { PlayCard } from './GameBoard';
import { PlayerContainer } from './PlayGame';
import CurrentlyPlayingWidget from './CurrentlyPlayingWidget';
import { playTrack } from '../util/spotifyAPI';

const JEOPARDY_THEME_URI = "spotify:track:4qkYiZablQoG7f0Qu4Nd1c";

function FinalJeopardy({ songData, token, onFinish }) {
	const [startedPlaying, setStartedPlaying] = useState(false);
	const [widgetNeedsRefresh, setWidgetNeedsRefresh] = useState(false);

	const refreshWidget = () => {
		setWidgetNeedsRefresh(!widgetNeedsRefresh);
	}

	useEffect(() => {
		if (!startedPlaying) {
			playTrack(JEOPARDY_THEME_URI, token).then(() => {
				refreshWidget();
			});
		} else {
			playTrack(songData.song.uri, token).then(() => {
				refreshWidget();
			});
		}
	}, [startedPlaying])

	return (
		<div className='login-wrapper'>
			<span className="login-text">
				{/* {songData.category}
				{songData.song.name} */}
				{ startedPlaying ?
					<div className='final-jeopardy-card-wrapper'>
						<PlayCard
							token={token}
							val={songData.song}
							refreshWidget={refreshWidget}
							revealCard={() => {}}
							setSelectedCard={() => { onFinish() }}
						/>
					</div> :
					<div className='final-jeopardy-card-wrapper'>
						<p>It's time for Final Jeopardy!</p>
						<p>Your hint is:</p>
						<p><strong>{songData.category}</strong></p>
						<button onClick={() => setStartedPlaying(true)}>Let's Go!!</button>
					</div>
				}	
				<CurrentlyPlayingWidget
					token={token}
					widgetNeedsRefresh={widgetNeedsRefresh}
					toggleRefresh={refreshWidget}
				/>
				<PlayerContainer isPlaying isFinalJeopardy/>
			</span>
		</div>
	);
}

export default FinalJeopardy;
