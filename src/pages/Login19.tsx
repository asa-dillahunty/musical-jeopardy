import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login19.module.scss";

export default function Login19() {
  return (
    <section className={styles.page} aria-labelledby="login19-title">
      <div className={styles.top}>
        <h1 id="login19-title">Find your key.</h1>
        <SpotifySignInButton className={styles.spotify} />
      </div>
      <div className={styles.keys} aria-hidden="true" />
      <LoginBetaHelp className={styles.help} />
    </section>
  );
}
