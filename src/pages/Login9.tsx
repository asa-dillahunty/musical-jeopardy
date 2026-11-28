import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login9.module.scss";

export default function Login9() {
  return (
    <section className={styles.page} aria-labelledby="login9-title">
      <div className={styles.window} aria-hidden="true">
        <div className={styles.record} />
      </div>
      <div className={styles.controls}>
        <h1 id="login9-title">Queue up a game.</h1>
        <SpotifySignInButton className={styles.spotify} />
      </div>
      <p className={styles.help}>
        Closed beta.{" "}
        <a href="https://github.com/asa-dillahunty/musical-jeopardy">
          Request access or a demo on GitHub.
        </a>
      </p>
    </section>
  );
}
