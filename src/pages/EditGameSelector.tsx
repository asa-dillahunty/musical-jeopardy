import { useDeleteGame, useGamesList } from "../util/firebaseAPIs";
import { FaRegTrashCan, FaWandMagicSparkles } from "react-icons/fa6";
import { FaArrowLeft, FaFileImport, FaPlus } from "react-icons/fa";
import { queryGemini } from "../util/gemini";
import ClickBlocker from "../components/ClickBlocker";
import { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import NumberInput from "../components/ui/NumberInput";
import { useAtomValue } from "jotai";
import { AccessToken } from "../util/atoms";
import { useUserId } from "../util/spotifyAPI";
import { Link, useNavigate } from "react-router-dom";
import GameSelector from "./GameSelector";

import styles from "./sass/EditGameSelector.module.scss";
import selectorStyles from "./sass/GameSelector.module.scss";

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

  const handleDeleteGame = (gameId: string) => {
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

  return (
    <section className={selectorStyles.page} aria-labelledby="edit-games-title">
      <ClickBlocker block={openForm} custom>
        <div className={styles.overlay}>
          <h2>Ask Gemini</h2>
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
          <div className={styles.actions}>
            <button
              type="button"
              className={`${selectorStyles.control} ${styles.primaryButton}`}
              onClick={askGemini}
            >
              Generate Game
            </button>
            <button
              type="button"
              className={`${selectorStyles.control} ${styles.secondaryButton}`}
              onClick={() => setOpenForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </ClickBlocker>
      <ClickBlocker block={askingGemini} custom>
        <div
          className={`${styles.overlay} ${styles.loadingOverlay}`}
          role="status"
        >
          <HiOutlineSparkles aria-hidden="true" />
          <p>Generating your game…</p>
        </div>
      </ClickBlocker>
      <Link className={selectorStyles.control} to="/menu">
        <FaArrowLeft aria-hidden="true" /> Main Menu
      </Link>
      <header className={selectorStyles.header}>
        <h1 id="edit-games-title">Edit Games</h1>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${selectorStyles.control} ${styles.primaryButton}`}
            onClick={openNewGame}
          >
            <FaPlus aria-hidden="true" /> New Game
          </button>
          <button
            type="button"
            className={`${selectorStyles.control} ${styles.secondaryButton}`}
            onClick={() => setOpenForm(true)}
          >
            <FaWandMagicSparkles aria-hidden="true" /> Ask Gemini
          </button>
          <Link className={selectorStyles.control} to="/import">
            <FaFileImport aria-hidden="true" /> Import Board
          </Link>
        </div>
      </header>
      {isLoading ? (
        <p className={selectorStyles.status} role="status">
          Loading games…
        </p>
      ) : isError || !gameList ? (
        <p className={selectorStyles.status} role="alert">
          Couldn’t load games. Contact the site owner.
        </p>
      ) : (
        <GameSelector
          games={gameList}
          userId={userId}
          renderMyGameAction={(game) => (
            <button
              className={styles.deleteGameButton}
              type="button"
              aria-label={`Delete ${game.name || "untitled game"}`}
              onClick={() => handleDeleteGame(game.id)}
            >
              <FaRegTrashCan aria-hidden="true" />
            </button>
          )}
        />
      )}
    </section>
  );
}
