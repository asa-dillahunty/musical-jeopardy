import "./sass/Login.css";
import { spotifyLogin } from "../util/spotifyAPI";
import logo from "../Spotify_Full_Logo_Black_RGB.svg";
import { clearSessionUrl } from "./AccessTokenHandler";

function Login() {
  const performLogin = () => {
    // in case you've refreshed before
    clearSessionUrl();
    spotifyLogin();
  };

  return (
    <div className="login-wrapper">
      <span className="login-text">Login with</span>
      <img
        className="btn-spotify"
        onClick={performLogin}
        src={logo}
        alt="Spotify logo. Login button"
      />
    </div>
  );
}

export default Login;
