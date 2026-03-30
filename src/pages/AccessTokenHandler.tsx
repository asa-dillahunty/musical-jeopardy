import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AccessToken,
  AccessTokenExpiration,
  RefreshToken,
} from "../util/atoms";
import { getTokenFromCode, refreshAccessToken } from "../util/spotifyAPI";

export default function AccessTokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(AccessToken);
  const setAccessTokenExpiration = useSetAtom(AccessTokenExpiration);
  const setRefreshToken = useSetAtom(RefreshToken);

  useEffect(() => {
    const hash = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.search.slice(1);

    const params = new URLSearchParams(hash);

    const code = params.get("code");

    getTokenFromCode(code).then(
      ({ access_token, expires_in, refresh_token }) => {
        if (access_token) {
          const expiration = Date.now() + expires_in * 1000;

          setAccessToken(access_token);
          setAccessTokenExpiration(expiration);
          setRefreshToken(refresh_token);

          const previousLocation = getSessionUrl();
          if (previousLocation !== "/menu")
            console.log("resuming session (hopefully)");

          navigate(previousLocation, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      },
    );
  }, [location, navigate]);

  return <p>Logging you in…</p>;
}

const SESSION_URL_STORAGE_KEY = "session_url_storage_key";

export const useRefreshAccessToken = () => {
  const setAccessToken = useSetAtom(AccessToken);
  const setAccessTokenExpiration = useSetAtom(AccessTokenExpiration);
  const [refreshToken, setRefreshToken] = useAtom(RefreshToken);

  return () => {
    refreshAccessToken(refreshToken).then(
      ({ access_token, refresh_token, expires_in }) => {
        if (access_token) {
          const expiration = Date.now() + expires_in * 1000;
          setAccessToken(access_token);
          setAccessTokenExpiration(expiration);
          setRefreshToken(refresh_token);
        }
      },
    );
  };
};

export const clearSessionUrl = () => {
  localStorage.setItem(SESSION_URL_STORAGE_KEY, "/menu");
};

const saveSessionUrl = (path: string) => {
  localStorage.setItem(SESSION_URL_STORAGE_KEY, path);
};

const getSessionUrl = () => {
  const sessionUrl = localStorage.getItem(SESSION_URL_STORAGE_KEY);

  return sessionUrl || "/menu";
};
