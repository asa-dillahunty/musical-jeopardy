import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login11.module.scss";

export default function Login11() {
  return (
    <section className={styles.board} aria-labelledby="login11-title">
      <h1 id="login11-title">
        <span>Name</span>
        <span>that tune.</span>
      </h1>
      <div className={styles.tiles}>
        <div className={styles.signIn}>
          <SpotifySignInButton className={styles.spotify} />
        </div>
        <div className={styles.help}>
          <h2>Closed beta</h2>
          <a href="https://github.com/asa-dillahunty/musical-jeopardy">
            Request access or a demo <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
