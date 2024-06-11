import { useEffect, useState } from 'react';
import GameBoard from './GameBoard';
import EditGame from './EditGame';

function Menu ({ token, page, setPage }) {
	switch(page) {
		case "play":
			return (
				<GameBoard token={token} />
			)
		case "build":
			return (
				<EditGame gameID={""} token={token} />
			);
		default: // menu
			return (
				<div className="menu-container">
					<button onClick={()=>setPage('build')}>Build/Edit Board</button>
					<button onClick={()=>setPage('play')}>Play Game</button>
				</div>
			);
	}
	
}

export default Menu;
