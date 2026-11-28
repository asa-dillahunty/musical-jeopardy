import { useDeleteGame, useGamesList } from "../util/firebaseAPIs";
import { FaRegTrashCan, FaWandMagicSparkles } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { queryGemini } from "../util/gemini";
import ClickBlocker from "../components/ClickBlocker";
import { useState, type MouseEvent } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import NumberInput from "../components/ui/NumberInput";
import { useAtomValue } from "jotai";
import { AccessToken } from "../util/atoms";
import { useUserId } from "../util/spotifyAPI";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton";
import GameSelector from "./GameSelector";

import styles from "./sass/GameSelector.module.scss";

export default function EditGameSelector() {
  const token = useAtomValue(AccessToken);
  const userId = useUserId();
  const navigate = useNavigate();

  const [askingGemini, setAskingGemini] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [numBoards, setNumBoards] = useState(1);
  const [numCategories, setNumCategories] = useState(3);
  const [numRows, setNumRows] = useState(3);

  const { data: gameList, isLoading, isError } = useGamesList();
  const deleteGameMutation = useDeleteGame();

  const openNewGame = () => navigate("new");

  const handleDeleteGame = (e: MouseEvent<SVGElement>, gameId: string) => {
    e.stopPropagation();
    if (!window.confirm("Confirm Delete?")) return;
    deleteGameMutation.mutateAsync(gameId);
  };

  const askGemini = () => {
    // show loading
    setOpenForm(false);
    setAskingGemini(true);
    const options = {
      numBoards: numBoards,
      cols: numCategories,
      rows: numRows,
    };

    queryGemini(token, userId, options)
      .then(() => {
        setAskingGemini(false);
        openNewGame();
      })
      .catch((e) => {
        alert(
          "Encountered an issue. Please try again, but not too many times if it persists.",
        );
        setAskingGemini(false);
        console.error(e.message);
      });
  };

  if (isLoading) {
    return <p>Loading</p>;
  }
  if (isError || !gameList) {
    return <p>Some error. Contact site owner.</p>;
  }

  return (
    <section className={styles.selectionSection}>
      <ClickBlocker block={openForm} custom>
        <div className={styles.formWrapper}>
          <div className={styles.valueContainer}>
            <NumberInput
              label={"Number of Boards"}
              value={numBoards}
              setValue={setNumBoards}
              maxVal={3}
              minVal={1}
            />
            <NumberInput
              label={"Number of Categories"}
              value={numCategories}
              setValue={setNumCategories}
              maxVal={6}
              minVal={3}
            />
            <NumberInput
              label={"Number of Rows"}
              value={numRows}
              setValue={setNumRows}
              maxVal={5}
              minVal={3}
            />
          </div>
          <button onClick={askGemini}>Submit</button>
          <button onClick={() => setOpenForm(false)}>Cancel</button>
        </div>
      </ClickBlocker>
      <ClickBlocker block={askingGemini} custom>
        <span className={styles.loadingGeminiMessage}>
          <div className={styles.sparkleWrapper}>
            <HiOutlineSparkles />
          </div>
          <div className={styles.textWrapper}>
            <h3>Asking Gemini!</h3>
            <p>(It's not very smart)</p>
          </div>
        </span>
      </ClickBlocker>
      <h2>Select a Game to Edit!</h2>
      <BackButton path="/menu" />
      <GameSelector
        games={gameList}
        userId={userId}
        renderMyGameAction={(gameId) => (
          <FaRegTrashCan onClick={(e) => handleDeleteGame(e, gameId)} />
        )}
      />
      <button id={styles.newGameButton} onClick={openNewGame}>
        New Game
        <FaPlus />
      </button>
      <button id={styles.askGeminiButton} onClick={() => setOpenForm(true)}>
        Ask Gemini
        <FaWandMagicSparkles />
      </button>
    </section>
  );
}
