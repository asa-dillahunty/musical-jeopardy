import './FinalJeopardy.css';
import React from 'react';

function FinalJeopardy({ songData }) {
	return (
		<div className='login-wrapper'>
			<span className="login-text">
				{songData.category}
				{songData.song.name}
			</span>
		</div>
	);
}

export default FinalJeopardy;
