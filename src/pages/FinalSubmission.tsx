import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SketchInput } from "../components/SketchInput";

import styles from "./sass/MobilePages.module.scss";
import Metronome from "../components/Metronome";
import {
  setPlayerReady,
  setPlayerSketch,
  setPlayerWager,
  subscribeToPlayer,
  usePartyPlayersListQuery,
} from "../util/firebaseAPIs";
import { useSetAtom } from "jotai";
import { NumPlayersAtom, PlayersAtom } from "../util/atoms";
import { PlayersContainer } from "../components/players/PlayersContainer";
import { PlayerType } from "../util/models";
import { CanvasPath } from "react-sketch-canvas";
import NumberInput from "../components/NumberInput";

type Unsubscribe = () => void;

let currentUnsubscribe: Unsubscribe | null = null;

// what's the user flow look like?
// - user joins
// - user selects their user
// - user selects their wager
// - user draws their answer

export default function FinalSubmission({}) {
  const navigate = useNavigate();
  const { partyId } = useParams();

  if (!partyId) {
    navigate("/join");
    return;
  }

  const setPlayers = useSetAtom(PlayersAtom);
  const setNumPlayers = useSetAtom(NumPlayersAtom);

  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(-1);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType | null>(null);

  const [wager, setWager] = useState(500);
  const [localReady, setLocalReady] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { data: partyData, isPending } = usePartyPlayersListQuery(partyId);

  const selectPlayer = (player: PlayerType) => {
    // unsubscribe if subscribed to someone already
    unsubscribe();

    // subscribe to that object, do not ready up
    currentUnsubscribe = subscribeToPlayer(
      partyId,
      player.index,
      setCurrentPlayer
    );

    // need to also display a back button
    setSelectedPlayerIndex(player.index);
    console.log(player.index);
  };

  const deselectPlayer = () => {
    // un-ready up the player

    // unsubscribe
    unsubscribe();

    setPlayerReady(partyId, selectedPlayerIndex, false);
    setLocalReady(false);
    setCurrentPlayer(null);
    setWager(500); // reset my wager, but maybe not the player's wager
    setSelectedPlayerIndex(-1);
  };

  const unsubscribe = () => {
    if (currentUnsubscribe) {
      currentUnsubscribe();
      currentUnsubscribe = null;
    }
  };

  const finalizeWager = () => {
    setPlayerWager(partyId, selectedPlayerIndex, wager);
    setLocalReady(true);
    setPlayerReady(partyId, selectedPlayerIndex, true);
  };

  const onFinishSketch = (paths: CanvasPath[]) => {
    setSubmitted(true);
    setPlayerSketch(partyId, selectedPlayerIndex, paths);
  };

  useEffect(() => {
    if (partyData && partyData.numPlayers) {
      setPlayers(partyData.players);
      setNumPlayers(partyData.numPlayers);
    }
  }, [partyData]);

  useEffect(() => {
    if (localReady && currentPlayer?.ready === false) {
      // someone has unreadied me up because they selected me on accident
      console.log("fixing ready state");
      setPlayerReady(partyId, selectedPlayerIndex, true);
    }
  }, [currentPlayer]);

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

  // draw and submit answer
  if (currentPlayer?.ready) {
    return (
      <div className={styles.container}>
        <button onClick={deselectPlayer} disabled={submitted}>
          Back
        </button>
        <p>{currentPlayer?.name}</p>
        <SketchInput onSubmit={onFinishSketch} disabled={submitted} />
      </div>
    );
  }

  // select wager
  if (selectedPlayerIndex !== -1) {
    return (
      <div className={styles.container}>
        <button onClick={deselectPlayer}>Back</button>
        <p>{currentPlayer?.name}</p>
        {currentPlayer && (
          <NumberInput
            label={"Wager"}
            value={wager}
            setValue={setWager}
            minVal={0}
            maxVal={Math.max(currentPlayer.score, 500)}
            incPerDigit
            topLabel
          />
        )}
        <button onClick={finalizeWager}>submit wager</button>
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
