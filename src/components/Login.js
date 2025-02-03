import "./Login.css";
import React from "react";
import { spotifyLogin } from "../util/spotifyAPI";
import logo from "../Spotify_Full_Logo_Black_RGB.svg";

function Login() {
  return (
    <div className="login-wrapper">
      <span className="login-text">Login with</span>
      <img
        className="btn-spotify"
        onClick={spotifyLogin}
        src={logo}
        alt="Spotify logo. Login button"
      />
    </div>
  );
}

export default Login;
