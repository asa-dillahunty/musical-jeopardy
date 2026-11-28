import { spotifyLogin } from "../util/spotifyAPI";
import logo from "../assets/Spotify_Full_Logo_Black_RGB.svg";
import { clearSessionUrl } from "./AccessTokenHandler";

import styles from "./sass/Login.module.scss";
import { FaGithub, FaMusic } from "react-icons/fa";

function Login({ variant }: { variant?: "record" | "ticket" | "poster" }) {
  const performLogin = () => {
    // in case you've refreshed before
    clearSessionUrl();
    spotifyLogin();
  };

  return (
    <div className={variant ? styles[variant] : styles.loginPage}>
      <section className={styles.signIn} aria-labelledby="sign-in-title">
        <div className={styles.artwork} aria-hidden="true">
          <FaMusic className={styles.musicIcon} />
        </div>
        <h1 id="sign-in-title">
          {variant === "record" ? "Cue the music." : "Sign in"}
        </h1>
        <button
          type="button"
          className={styles.spotifyButton}
          onClick={performLogin}
        >
          Continue with <img src={logo} alt="Spotify" />
        </button>
      </section>
      <section className={styles.infoSection} aria-labelledby="login-help-title">
        <h2 id="login-help-title">Can’t log in?</h2>
        <p>
          Musical Jeopardy is in closed beta. If you’d like access or want to see
          a demo, reach out on GitHub.
        </p>
        <a
          className={styles.githubLink}
          href="https://github.com/asa-dillahunty/musical-jeopardy"
        >
          <FaGithub aria-hidden="true" />
          GitHub
          <span aria-hidden="true">↗</span>
        </a>
      </section>
    </div>
  );
}

export default Login;
