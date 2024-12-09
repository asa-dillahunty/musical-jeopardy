import './FinalJeopardy.css';
import React, { useState } from 'react';
import { PlayCard } from './GameBoard';
import { PlayerContainer } from './PlayGame';
import CurrentlyPlayingWidget from './CurrentlyPlayingWidget';

function FinalJeopardy({ songData, token, onFinish }) {
	console.log("rendering final jeopardy")
	const [widgetNeedsRefresh, setWidgetNeedsRefresh] = useState(false);

	const refreshWidget = () => {
		setWidgetNeedsRefresh(!widgetNeedsRefresh);
	}

	return (
		<div className='login-wrapper'>
			<span className="login-text">
				{songData.category}
				{songData.song.name}
				<PlayCard
					token={token}
					val={songData.song}
					refreshWidget={refreshWidget}
					revealCard={() => {}}
					setSelectedCard={() => { onFinish() }}
				/>
				<CurrentlyPlayingWidget
					token={token}
					widgetNeedsRefresh={widgetNeedsRefresh}
					toggleRefresh={refreshWidget}
				/>
				<PlayerContainer isPlaying/>
			</span>
		</div>
	);
}

export default FinalJeopardy;
