import type { ReactNode } from "react";
import { FaArrowRight, FaMusic } from "react-icons/fa";
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
        <li key={game.id} className={styles.gameTile}>
          <Link className={styles.gameLink} to={getGameDestination(game.id)}>
            <span className={styles.tileIcons} aria-hidden="true">
              <FaMusic />
              <FaArrowRight />
            </span>
            <span>{game.name || "Untitled game"}</span>
          </Link>
          {renderAction?.(game)}
        </li>
      ))}
    </ul>
  );
}
