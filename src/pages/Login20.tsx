import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login20.module.scss";

export default function Login20() {
  return (
    <section className={styles.page} aria-labelledby="login20-title">
      <div className={styles.poster}>
        <h1 id="login20-title">
          <span>Tonight’s</span>
          <span>setlist</span>
        </h1>
      </div>
      <div className={styles.footer}>
        <SpotifySignInButton className={styles.spotify} />
        <LoginBetaHelp className={styles.help} />
      </div>
    </section>
  );
}
