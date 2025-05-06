import Metronome from "./Metronome";
import styles from "./sass/Loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <Metronome />
    </div>
  );
}
