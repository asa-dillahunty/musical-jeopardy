import { FaHeadphones } from "react-icons/fa";
import LoginBetaHelp from "../components/LoginBetaHelp";
import SpotifySignInButton from "../components/SpotifySignInButton";
import styles from "./sass/Login18.module.scss";

export default function Login18() {
  return (
    <section className={styles.page} aria-labelledby="login18-title">
      <div className={styles.arch} aria-hidden="true">
        <FaHeadphones />
      </div>
      <h1 id="login18-title">Listen up.</h1>
      <SpotifySignInButton className={styles.spotify} />
      <LoginBetaHelp className={styles.help} />
    </section>
  );
}
