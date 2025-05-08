import { useState } from "react";
import { useUpdatePlayerScore } from "../../util/atoms";
import { PlayerType } from "../../util/models";
import ClickBlocker from "../ClickBlocker";
import PlayerIcon from "./PlayerIcon";
import SketchDisplay from "../SketchDisplay";

import styles from "./sass/FinalJeopardyPlayersContainer.module.scss";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

export interface FinalJeopardyPlayersContainerProps {
  players: PlayerType[];
  numPlayers: number;
}

export default function FinalJeopardyPlayersContainer({
  players,
  numPlayers,
}: FinalJeopardyPlayersContainerProps) {
  return (
    <div className="player-container">
      {players.map((player, index) => {
        if (index < numPlayers) {
          return <PlayerDisplayWithSketch player={player} />;
        }
      })}
    </div>
  );
}

function PlayerDisplayWithSketch({ player }: { player: PlayerType }) {
  const updatePlayerScore = useUpdatePlayerScore();
  const [showSketch, setShowSketch] = useState(false);
  const [showWager, setShowWager] = useState(false);

  const win = (e: React.MouseEvent) => {
    if (player.wager) {
      updatePlayerScore(player.index, player.score + player.wager);
      setShowSketch(false);
      setShowWager(false);
      e.stopPropagation();
    }
  };

  const lose = (e: React.MouseEvent) => {
    if (player.wager) {
      updatePlayerScore(player.index, player.score - player.wager);
      setShowSketch(false);
      setShowWager(false);
      e.stopPropagation();
    }
  };

  // when click player -> show sketch
  // TODO:
  //   display if a player is ready
  //   show answer -> then show wager
  //   close the click blocker

  return (
    <div
      className={
        "player-icon-wrapper selectable" + (player.ready ? " selected" : "")
      }
      onClick={() => setShowSketch(true)}
    >
      <ClickBlocker block={showSketch} custom>
        <div className={styles.modalWrapper}>
          <SketchDisplay paths={player.sketch} />
          {showWager && (
            <div className={styles.wagerContainer}>
              <p className={styles.wagerAmount}>${player.wager}</p>
              <div className={styles.resultButtons}>
                <button
                  className={`${styles.resultButton} ${styles.failure}`}
                  onClick={lose}
                >
                  <FaXmark />
                </button>
                <button
                  className={`${styles.resultButton} ${styles.success}`}
                  onClick={win}
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          )}

          {!showWager && (
            <button
              className={styles.revealButton}
              onClick={(e) => {
                setShowWager(true);
                e.stopPropagation();
              }}
            >
              Reveal Wager
            </button>
          )}

          <button
            className={styles.closeButton}
            onClick={(e) => {
              setShowSketch(false);
              setShowWager(false);
              e.stopPropagation();
            }}
          >
            <FaXmark />
          </button>
        </div>
      </ClickBlocker>
      <PlayerIcon color={player.color} url={player.url} />
      <p className="player-name">{player.name}</p>
      <p className="player-score">${player.score}</p>
    </div>
  );
}
