import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./sass/GameSelector.module.scss";

type GameSelectorProps = {
  games: { id: string; name?: string; userID?: string }[];
  userId: string | undefined;
  renderMyGameAction?: (gameId: string) => ReactNode;
};

export default function GameSelector({
  games,
  userId,
  renderMyGameAction,
}: GameSelectorProps) {
  const navigate = useNavigate();
  const myGames = games.filter((game) => game.userID === userId);
  const otherGames = games.filter((game) => game.userID !== userId);

  return (
    <>
      <p>My Games</p>
      <ul className={styles.gameSelectorList}>
        {myGames.map((game, index) => (
          <li key={index} onClick={() => navigate(game.id)}>
            {game.name}
            {renderMyGameAction?.(game.id)}
          </li>
        ))}
      </ul>
      <p>Public Games</p>
      <ul className={styles.gameSelectorList}>
        {otherGames.map((game, index) => (
          <li key={index} onClick={() => navigate(game.id)}>
            {game.name}
          </li>
        ))}
      </ul>
    </>
  );
}
