import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login6.module.scss";

export default function Login6() {
  return (
    <section className={styles.deck} aria-labelledby="deck-title">
      <div className={styles.turntable} aria-hidden="true">
        <div className={styles.record} />
        <div className={styles.tonearm} />
      </div>
      <div className={styles.controls}>
        <h1 id="deck-title">Drop the needle.</h1>
        <SpotifySignInButton className={styles.spotify} />
        <p>
          In closed beta.{" "}
          <a href="https://github.com/asa-dillahunty/musical-jeopardy">
            Ask for access or a demo on GitHub.
          </a>
        </p>
      </div>
    </section>
  );
}
