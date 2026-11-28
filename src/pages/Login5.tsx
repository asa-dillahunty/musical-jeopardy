import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login5.module.scss";

export default function Login5() {
  return (
    <div className={styles.page}>
      <section className={styles.record} aria-labelledby="label-title">
        <div className={styles.label}>
          <span className={styles.spindle} aria-hidden="true" />
          <h1 id="label-title">Sign in</h1>
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
