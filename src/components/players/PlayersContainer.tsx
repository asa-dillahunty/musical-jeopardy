import { useAtomValue } from "jotai";
import { NumPlayersAtom, PlayersAtom } from "../../util/atoms";
import { PlayerDisplay } from "./PlayerDisplay";
import { PlayerType } from "../../util/models";

export interface PlayerContainerProps {
  onClickPlayer?: (player: PlayerType, status?: string) => void;
  isPlaying?: boolean;
  isSidebar?: boolean;
  selectedPlayer?: PlayerType;
  isFinalJeopardy?: boolean;
}

export function PlayersContainer({
  onClickPlayer,
  isPlaying = false,
  isSidebar = false,
  selectedPlayer,
  isFinalJeopardy = false,
}: PlayerContainerProps) {
  const numPlayers = useAtomValue(NumPlayersAtom);
  const players = useAtomValue(PlayersAtom);
  const className = isSidebar ? "player-container sidebar" : "player-container";

  return (
    <div className={className}>
      {players.map((player, index) => {
        return (
          <PlayerDisplay
            data={player}
            display={index < numPlayers}
            onClickPlayer={onClickPlayer}
            isPlaying={isPlaying}
            selectedPlayer={selectedPlayer}
            key={index}
            isFinalJeopardy={isFinalJeopardy}
          />
        );
      })}
    </div>
  );
}
