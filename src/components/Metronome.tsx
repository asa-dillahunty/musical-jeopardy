import styles from "./sass/Metronome.module.scss";

export default function Metronome() {
  return (
    <div className={styles.metronomeSizer}>
      <div className={styles.metronomeContainer}>
        <div className={styles.metronomeBase} />
        <div className={styles.metronomeStand} />
        <div className={styles.metronomeBackPlate} />
        <div className={styles.metronomePlateLine} />
        <div className={styles.metronomeArm} />
      </div>
    </div>
  );
}
