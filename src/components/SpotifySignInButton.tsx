import logo from "../assets/Spotify_Full_Logo_Black_RGB.svg";
import { clearSessionUrl } from "../pages/AccessTokenHandler";
import { spotifyLogin } from "../util/spotifyAPI";

export default function SpotifySignInButton({
  className,
}: {
  className: string;
}) {
  const signIn = () => {
    clearSessionUrl();
    spotifyLogin();
  };

  return (
    <button type="button" className={className} onClick={signIn}>
      Continue with <img src={logo} alt="Spotify" />
    </button>
  );
}
