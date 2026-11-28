import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import styles from "./sass/GameList.module.scss";

export type GameListEntry = {
  id: string;
  name?: string;
};

type GameListProps = {
  games: GameListEntry[];
  getGameDestination: (gameId: string) => string;
  renderAction?: (game: GameListEntry) => ReactNode;
};

export default function GameList({
  games,
  getGameDestination,
  renderAction,
}: GameListProps) {
  return (
    <ul className={styles.gameList}>
      {games.map((game) => (
        <li key={game.id} className={styles.gameRow}>
          <Link className={styles.gameLink} to={getGameDestination(game.id)}>
            {game.name || "Untitled game"}
          </Link>
          {renderAction?.(game)}
        </li>
      ))}
    </ul>
  );
}
