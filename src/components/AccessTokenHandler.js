// src/Callback.jsx
import { useSetAtom } from "jotai";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessToken } from "../util/atoms";

export default function AccessTokenHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  const setAccessToken = useSetAtom(AccessToken);

  useEffect(() => {
    const hash = location.hash.startsWith("#")
      ? location.hash.slice(1)
      : location.search.slice(1);

    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (token) {
      setAccessToken(token);
      console.log(token);
      navigate("/menu", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  return <p>Logging you in…</p>;
}
