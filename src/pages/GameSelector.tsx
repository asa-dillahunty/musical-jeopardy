import type { ReactNode } from "react";

import GameList, { type GameListEntry } from "../components/GameList";

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
    <>
      <p>My Games</p>
      <GameList
        games={myGames}
        getGameDestination={getGameDestination}
        renderAction={renderMyGameAction}
      />
      <p>Public Games</p>
      <GameList games={otherGames} getGameDestination={getGameDestination} />
    </>
  );
}
