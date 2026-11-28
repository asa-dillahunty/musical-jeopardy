import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login8.module.scss";

export default function Login8() {
  return (
    <section className={styles.page} aria-labelledby="login8-title">
      <div className={styles.artwork} aria-hidden="true" />
      <div className={styles.content}>
        <h1 id="login8-title">Give it a spin.</h1>
        <SpotifySignInButton className={styles.spotify} />
        <p>
          Musical Jeopardy is in closed beta.{" "}
          <a href="https://github.com/asa-dillahunty/musical-jeopardy">
            Request access or a demo on GitHub.
          </a>
        </p>
      </div>
    </section>
  );
}
