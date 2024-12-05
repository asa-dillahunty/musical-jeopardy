import { signal } from '@preact/signals-react';

const initialState = {
	players: [
		{ index: 0, name: "Player 1", color: "red", score: 0 },
		{ index: 1, name: "Player 2", color: "blue", score: 0 },
		{ index: 2, name: "Player 3", color: "yellow", score: 0 },
		{ index: 3, name: "Player 4", color: "green", score: 0 },
		{ index: 4, name: "Player 5", color: "black", score: 0 },
		{ index: 5, name: "Player 6", color: "white", score: 0 },
		{ index: 6, name: "Player 7", color: "pink", score: 0 },
		{ index: 7, name: "Player 8", color: "purple", score: 0 },
	],
	viewedCards: [],
	currentGameId: null,
	gameBoard: { boardNumber: 1, state: 'normal' }
};

// Load data from localStorage if available
const loadFromStorage = (key, fallback) => {
	const stored = localStorage.getItem(key);
	return stored ? JSON.parse(stored) : fallback;
};

// Define signals for each piece of state
export const playersSignal = signal(loadFromStorage('players', initialState.players));
export const numPlayersSignal = signal(loadFromStorage('numPlayers', 2));
export const viewedCardsSignal = signal(loadFromStorage('viewedCards', []));
export const currentGameIdSignal = signal(loadFromStorage('currentGameId', null));
export const gameBoardSignal = signal(loadFromStorage('gameBoard', { boardNumber: 1, state: 'normal' }));

// Save the state to local storage whenever it changes
playersSignal.subscribe(() => localStorage.setItem('players', JSON.stringify(playersSignal.value)));
numPlayersSignal.subscribe(() => localStorage.setItem('numPlayers', JSON.stringify(numPlayersSignal.value)));
viewedCardsSignal.subscribe(() => localStorage.setItem('viewedCards', JSON.stringify(viewedCardsSignal.value)));
currentGameIdSignal.subscribe(() => localStorage.setItem('currentGameId', JSON.stringify(currentGameIdSignal.value)));
gameBoardSignal.subscribe(() => localStorage.setItem('gameBoard', JSON.stringify(gameBoardSignal.value)));

export const updatePlayerName = (playerIndex, name) => {
	playersSignal.value = playersSignal.value.map((player, index) =>
		playerIndex === index ? { ...player, name } : player
	);
}

export const updatePlayerScore = (playerIndex, score) => {
	score = parseInt(score);
	const playersCopy = playersSignal.value.map((player, index) =>
		playerIndex === index ? { ...player, score } : player
	);
	playersSignal.value = [...playersCopy];
};

export function storeGame(gameData) {
	localStorage.setItem('selectedGame', JSON.stringify(gameData));
}

export function getGameFromStorage() {
	return loadFromStorage('selectedGame', null);
}
