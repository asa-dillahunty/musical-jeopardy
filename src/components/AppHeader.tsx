import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessToken, AccessTokenExpiration } from "../util/atoms";
import { useEffect, useState } from "react";

import styles from "./sass/AppHeader.module.scss";
import { useRefreshAccessToken } from "../pages/AccessTokenHandler";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const atLogin = location.pathname === "/";

  const dev = window.location.hostname === "localhost";

  return (
    <header className={styles.appHeader}>
      {dev && (
        <button onClick={() => localStorage.clear()}>
          clear local storage
        </button>
      )}
      <span onClick={() => navigate("/menu")} className={styles.headerTitle}>
        MUSICAL JEOPARDY
      </span>

      {!atLogin && <TokenStatus />}
    </header>
  );
}

function TokenStatus() {
  const expiration = useAtomValue(AccessTokenExpiration);
  const token = useAtomValue(AccessToken);
  //   const [expiration, setExpiration] = useState(Date.now() + 10000);
  //   const [expiration, setExpiration] = useState(Date.now() + 5 * 60 * 1000 + 5);
  const refreshToken = useRefreshAccessToken();
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, expiration - Date.now())
  );

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  useEffect(() => {
    // tick down every second
    const id = setInterval(() => {
      const newTimeLeft = Math.max(0, expiration - Date.now());
      if (newTimeLeft === 0) {
        clearInterval(id);
      }
      setTimeLeft(newTimeLeft);
    }, 1000);
    return () => clearInterval(id);
  }, [expiration]);

  const ExpirationText = () => {
    if (timeLeft < 1 || !token || token === "") {
      return (
        <span className={styles.expirationTextUrgent}>Token Expired 0:00</span>
      );
    } else if (minutes < 1) {
      return (
        <span className={styles.expirationTextUrgent}>
          Token Expires in {minutes}:{seconds}
        </span>
      );
    } else {
      return (
        <span className={styles.expirationText}>
          Token Expires in {minutes}:{seconds}
        </span>
      );
    }
  };

  // we are good on time. No need to display
  if (minutes > 4) {
    return <></>;
  }

  return (
    <div className={styles.expirationClock}>
      <ExpirationText />
      <button className={styles.expirationRefresh} onClick={refreshToken}>
        Refresh
      </button>
    </div>
  );
}
