import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login14.module.scss";

export default function Login14() {
  return (
    <section className={styles.page} aria-labelledby="login14-title">
      <div className={styles.marquee}>
        <div className={styles.face}>
          <h1 id="login14-title">It’s showtime!</h1>
          <SpotifySignInButton className={styles.spotify} />
        </div>
      </div>
      <LoginBetaHelp className={styles.help} />
    </section>
  );
}
