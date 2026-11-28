import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login7.module.scss";

export default function Login7() {
  return (
    <section className={styles.page} aria-labelledby="login7-title">
      <div className={styles.sleeve} aria-hidden="true">
        <div className={styles.vinyl} />
      </div>
      <div className={styles.content}>
        <h1 id="login7-title">On the record.</h1>
        <SpotifySignInButton className={styles.spotify} />
        <p>
          Closed beta.{" "}
          <a href="https://github.com/asa-dillahunty/musical-jeopardy">
            Request access or a demo on GitHub.
          </a>
        </p>
      </div>
    </section>
  );
}
