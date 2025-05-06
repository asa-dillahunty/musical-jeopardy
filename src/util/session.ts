// Load data from localStorage if available
const loadFromStorage = (key: string, fallback: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : fallback;
};

export function storeGame(gameData) {
  localStorage.setItem("selectedGame", JSON.stringify(gameData));
}

export function getGameFromStorage() {
  return loadFromStorage("selectedGame", null);
}

export function storeGameSession(sessionData) {
  localStorage.setItem("activeSession", JSON.stringify(sessionData));
}

export function getGameSessionFromStorage() {
  return loadFromStorage("activeSession", null);
}
