import { spotifyLogin } from "../util/spotifyAPI";
import logo from "../assets/Spotify_Full_Logo_Black_RGB.svg";
import { clearSessionUrl } from "./AccessTokenHandler";

import styles from "./sass/Login.module.scss";
import { FaAngleRight, FaGithub } from "react-icons/fa";

function Login() {
  const performLogin = () => {
    // in case you've refreshed before
    clearSessionUrl();
    spotifyLogin();
  };

  return (
    <div className={styles.loginWrapper}>
      <span className={styles.loginText}>Login with</span>
      <img
        className={styles.btnSpotify}
        onClick={performLogin}
        src={logo}
        alt="Spotify logo. Login button"
      />
      <section className={styles.infoSection}>
        <span>
          <FaAngleRight /> Can't log in?
        </span>
        <p>
          Right now Musical Jeopardy is in closed beta. If you'd like to use the
          application or see a demo, feel free to reach out.
        </p>
        <button
          className={styles.githubButton}
          onClick={() =>
            (window.location.href =
              "https://github.com/asa-dillahunty/musical-jeopardy")
          }
        >
          <FaGithub />
          GitHub Page
        </button>
      </section>
    </div>
  );
}

export default Login;
