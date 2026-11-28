import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login12.module.scss";

export default function Login12() {
  return (
    <section className={styles.page} aria-labelledby="login12-title">
      <div className={styles.copy}>
        <h1 id="login12-title">Press play.</h1>
        <SpotifySignInButton className={styles.spotify} />
        <p>
          Musical Jeopardy is in closed beta.{" "}
          <a href="https://github.com/asa-dillahunty/musical-jeopardy">
            Request access or a demo on GitHub.
          </a>
        </p>
      </div>
      <div className={styles.art} aria-hidden="true">
        <div className={styles.cassette}>
          <div className={styles.reels} />
        </div>
      </div>
    </section>
  );
}
