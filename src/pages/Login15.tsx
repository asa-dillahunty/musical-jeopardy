import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login15.module.scss";

export default function Login15() {
  return (
    <section className={styles.page} aria-labelledby="login15-title">
      <div className={styles.headline}>
        <h1 id="login15-title">The music round</h1>
      </div>
      <div className={styles.columns}>
        <p className={styles.intro}>Build a board or host a game with Spotify.</p>
        <div className={styles.entry}>
          <SpotifySignInButton className={styles.spotify} />
          <LoginBetaHelp className={styles.help} />
        </div>
      </div>
    </section>
  );
}
