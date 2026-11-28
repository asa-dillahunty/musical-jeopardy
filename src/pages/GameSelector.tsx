import type { ReactNode } from "react";

import GameList, { type GameListEntry } from "../components/GameList";

import styles from "./sass/GameSelector.module.scss";

type CatalogGame = GameListEntry & { userId?: string };

type GameSelectorProps = {
  games: CatalogGame[];
  userId: string | undefined;
  renderMyGameAction?: (game: GameListEntry) => ReactNode;
};

const getGameDestination = (gameId: string) => encodeURIComponent(gameId);

export default function GameSelector({
  games,
  userId,
  renderMyGameAction,
}: GameSelectorProps) {
  const isMyGame = (game: CatalogGame) =>
    Boolean(userId) && game.userId === userId;
  const myGames = games.filter(isMyGame);
  const otherGames = games.filter((game) => !isMyGame(game));

  return (
    <div className={styles.catalog}>
      <section className={styles.panel}>
        <h2>My Games</h2>
        {myGames.length > 0 ? (
          <GameList
            games={myGames}
            getGameDestination={getGameDestination}
            renderAction={renderMyGameAction}
          />
        ) : (
          <p className={styles.emptyMessage}>You haven’t created any games yet.</p>
        )}
      </section>
      <section className={styles.panel}>
        <h2>Public Games</h2>
        {otherGames.length > 0 ? (
          <GameList games={otherGames} getGameDestination={getGameDestination} />
        ) : (
          <p className={styles.emptyMessage}>No public games available.</p>
        )}
      </section>
    </div>
  );
}
