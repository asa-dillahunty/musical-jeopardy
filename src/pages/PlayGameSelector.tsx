import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useGamesList } from "../util/firebaseAPIs";
import { useUserId } from "../util/spotifyAPI";
import GameSelector from "./GameSelector";

import styles from "./sass/GameSelector.module.scss";

export default function PlayGameSelector() {
  const userId = useUserId();
  const { data: gameList, isLoading, isError } = useGamesList();

  return (
    <section className={styles.page} aria-labelledby="play-games-title">
      <Link className={styles.control} to="/menu">
        <FaArrowLeft aria-hidden="true" /> Main Menu
      </Link>
      <header className={styles.header}>
        <h1 id="play-games-title">Play Games</h1>
      </header>
      {isLoading ? (
        <p className={styles.status} role="status">Loading games…</p>
      ) : isError || !gameList ? (
        <p className={styles.status} role="alert">Couldn’t load games. Contact the site owner.</p>
      ) : (
        <GameSelector games={gameList} userId={userId} />
      )}
    </section>
  );
}
