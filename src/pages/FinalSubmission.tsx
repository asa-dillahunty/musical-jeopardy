import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SketchInput } from "../components/SketchInput";

import styles from "./sass/MobilePages.module.scss";
import Metronome from "../components/Metronome";

export default function FinalSubmission({}) {
  const { partyId } = useParams();

  const [players, setPlayers] = useState();
  const [selected, setSelected] = useState("");
  const [wager, setWager] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // const playersRef = ref(db, `games/${gameCode}/players`);
    // const unsubscribe = onValue(playersRef, (snapshot) => {
    //   setPlayers(snapshot.val() || {});
    // });
    // return () => unsubscribe();
    setPlayers({
      player1: { name: "Alice" },
      player2: { name: "Bob" },
      player3: { name: "Charlie" },
    });
  }, [partyId]);

  const isLoading = true;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Metronome />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <span>{partyId}</span>
      <SketchInput />
    </div>
  );
}
