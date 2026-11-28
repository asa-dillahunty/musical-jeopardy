import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login17.module.scss";

export default function Login17() {
  return (
    <section className={styles.page} aria-labelledby="login17-title">
      <div className={styles.pad} aria-hidden="true">
        <div className={styles.buzzer} />
      </div>
      <div className={styles.content}>
        <h1 id="login17-title">Ready to buzz in?</h1>
        <SpotifySignInButton className={styles.spotify} />
        <LoginBetaHelp className={styles.help} />
      </div>
    </section>
  );
}
