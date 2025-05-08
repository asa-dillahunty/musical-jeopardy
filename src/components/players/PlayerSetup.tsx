import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import { NumPlayersAtom, PlayersAtom, useResetPlayers } from "../../util/atoms";
import ClickBlocker from "../ClickBlocker";
import NumberInput from "../NumberInput";
import PlayerEdit from "./PlayerEdit";
import { PlayersContainer } from "./PlayersContainer";

import styles from "./sass/PlayerSetup.module.scss";
import { PlayerType } from "../../util/models";
import { useNavigate } from "react-router-dom";

export default function PlayerSetup({
  setPlayersInitialized,
}: {
  setPlayersInitialized: (state: boolean) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);
  const [numPlayers, setNumPlayers] = useAtom(NumPlayersAtom);

  const players = useAtomValue(PlayersAtom);
  const resetPlayers = useResetPlayers();
  const navigate = useNavigate();

  const openEdit = (player: PlayerType) => {
    setSelectedPlayerIndex(player.index);
    setEditing(true);
  };

  const finishSetup = () => {
    setPlayersInitialized(true);
  };

  return (
    <div className={styles.wrapper}>
      <button onClick={() => navigate("/play")}>Back</button>
      <ClickBlocker custom block={editing}>
        <PlayerEdit
          selectedPlayerIndex={selectedPlayerIndex}
          setEditing={setEditing}
        />
      </ClickBlocker>
      <NumberInput
        label={"Total Players"}
        value={numPlayers}
        setValue={setNumPlayers}
        maxVal={players.length}
        minVal={1}
      />
      <PlayersContainer onClickPlayer={openEdit} />
      <button onClick={() => finishSetup()} className={styles.readyButton}>
        Ready
      </button>
      <button onClick={() => resetPlayers()} className={styles.resetButton}>
        Reset Players
      </button>
    </div>
  );
}
