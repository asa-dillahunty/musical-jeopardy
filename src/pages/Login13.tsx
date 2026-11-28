import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login13.module.scss";

export default function Login13() {
  return (
    <section className={styles.page} aria-labelledby="login13-title">
      <div className={styles.poster}>
        <div className={styles.wave} aria-hidden="true" />
        <h1 id="login13-title">Sound check.</h1>
      </div>
      <div className={styles.signIn}>
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
