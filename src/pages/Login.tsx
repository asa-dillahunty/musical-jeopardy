import { spotifyLogin } from "../util/spotifyAPI";
import logo from "../assets/Spotify_Full_Logo_Black_RGB.svg";
import { clearSessionUrl } from "./AccessTokenHandler";

import styles from "./sass/Login.module.scss";

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
    </div>
  );
}

export default Login;
