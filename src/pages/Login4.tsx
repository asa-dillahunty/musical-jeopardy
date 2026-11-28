import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login4.module.scss";

export default function Login4() {
  return (
    <div className={styles.page}>
      <section className={styles.sleeve} aria-labelledby="sleeve-title">
        <div className={styles.record} aria-hidden="true" />
        <div className={styles.cover}>
          <h1 id="sleeve-title">
            Cue the
            <br />
            music.
          </h1>
          <SpotifySignInButton className={styles.spotify} />
        </div>
      </section>
      <p className={styles.help}>
        In closed beta.{" "}
        <a href="https://github.com/asa-dillahunty/musical-jeopardy">
          Ask for access or a demo on GitHub.
        </a>
      </p>
    </div>
  );
}
