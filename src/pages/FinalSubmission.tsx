import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SketchInput } from "../components/SketchInput";

import styles from "./sass/MobilePages.module.scss";
import Metronome from "../components/Metronome";
import { usePartyPlayersListQuery } from "../util/firebaseAPIs";
import { useSetAtom } from "jotai";
import { NumPlayersAtom, PlayersAtom } from "../util/atoms";
import { PlayersContainer } from "../components/players/PlayersContainer";
import { PlayerType } from "../util/models";
import { CanvasPath } from "react-sketch-canvas";

export default function FinalSubmission({}) {
  const { partyId } = useParams();
  const setPlayers = useSetAtom(PlayersAtom);
  const setNumPlayers = useSetAtom(NumPlayersAtom);

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(-1);
  const [wager, setWager] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: partyData, isPending } = usePartyPlayersListQuery(partyId);
  console.log("list:", partyData);

  const selectPlayer = (player: PlayerType) => {
    // subscribe to that object, and ready them up
    // need to also display a back button
    setSelectedPlayerIndex(player.index);
  };

  const deselectPlayer = () => {
    // un-ready up the player
    // unsubscribe
    setSelectedPlayerIndex(-1);
  };

  const onFinishSketch = (paths: CanvasPath[]) => {
    console.log(paths);
  };

  useEffect(() => {
    if (partyData && partyData.numPlayers) {
      setPlayers(partyData.players);
      setNumPlayers(partyData.numPlayers);
    }
  }, [partyData]);

  if (isPending) {
    return (
      <div className={styles.container}>
        <Metronome />
      </div>
    );
  }

  if (!partyData) {
    return <p>That game doesn't exist</p>;
  }

  // final jeopardy submission
  if (selectedPlayerIndex !== -1) {
    return (
      <div className={styles.container}>
        <button onClick={deselectPlayer}>Back</button>
        <p>{partyData.players[selectedPlayerIndex].name}</p>
        <SketchInput onSubmit={onFinishSketch} />
      </div>
    );
  }

  // player select
  return (
    <div className={styles.container}>
      <span>{partyId}</span>
      <p>Who are you?</p>
      <PlayersContainer onClickPlayer={selectPlayer} />
    </div>
  );
}
