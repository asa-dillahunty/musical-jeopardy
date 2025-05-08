// src/Callback.jsx
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessToken, AccessTokenExpiration } from "../util/atoms";
import { spotifyLogin } from "../util/spotifyAPI";

export default function AccessTokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(AccessToken);
  const setAccessTokenExpiration = useSetAtom(AccessTokenExpiration);

  useEffect(() => {
    const hash = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.search.slice(1);

    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    const expires_in = parseInt(params.get("expires_in") || "0");
    const expiration = Date.now() + expires_in * 1000;

    if (token) {
      setAccessToken(token);
      setAccessTokenExpiration(expiration);

      const previousLocation = getSessionUrl();
      if (previousLocation !== "/menu")
        console.log("resuming session (hopefully)");

      navigate(previousLocation, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return <p>Logging you in…</p>;
}

const SESSION_URL_STORAGE_KEY = "session_url_storage_key";

export const useRefreshAccessToken = () => {
  const location = useLocation();
  return () => {
    saveSessionUrl(location.pathname);
    spotifyLogin();
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
