import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login16.module.scss";

export default function Login16() {
  return (
    <section className={styles.deck} aria-labelledby="login16-title">
      <div className={styles.faders} aria-hidden="true">
        <div className={styles.track} />
        <div className={styles.track} />
        <div className={styles.track} />
        <div className={styles.track} />
      </div>
      <div className={styles.entry}>
        <h1 id="login16-title">Set the levels.</h1>
        <SpotifySignInButton className={styles.spotify} />
        <LoginBetaHelp className={styles.help} />
      </div>
    </section>
  );
}
