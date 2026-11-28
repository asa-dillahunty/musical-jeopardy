import BackButton from "../components/ui/BackButton";
import { useGamesList } from "../util/firebaseAPIs";
import { useUserId } from "../util/spotifyAPI";
import GameSelector from "./GameSelector";

import styles from "./sass/GameSelector.module.scss";

export default function PlayGameSelector() {
  const userId = useUserId();
  const { data: gameList, isLoading, isError } = useGamesList();

  if (isLoading) {
    return <p>Loading</p>;
  }
  if (isError || !gameList) {
    return <p>Some error. Contact site owner.</p>;
  }

  return (
    <section className={styles.selectionSection}>
      <h2>Select a Game to Play!</h2>
      <BackButton path="/menu" />
      <GameSelector games={gameList} userId={userId} />
    </section>
  );
}
