import { useAtomValue } from "jotai";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessToken, AccessTokenExpiration } from "../util/atoms";
import { useEffect, useState } from "react";

import styles from "./sass/AppHeader.module.scss";
import { useRefreshAccessToken, useUserData } from "../util/spotifyAPI";
import { GrLogout } from "react-icons/gr";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const atLogin = location.pathname === "/";

  const dev = window.location.hostname === "127.0.0.1";

  const onClickHeader = () => {
    if (atLogin) {
      // we don't want to do anything here. The user is not logged in
    } else {
      navigate("/menu");
    }
  };

  return (
    <header className={styles.appHeader}>
      {dev && (
        <button onClick={() => localStorage.clear()}>
          clear local storage
        </button>
      )}
      <span onClick={onClickHeader} className={styles.headerTitle}>
        MUSICAL JEOPARDY
      </span>

      {!atLogin && <TokenStatus />}
    </header>
  );
}

function TokenStatus() {
  const expiration = useAtomValue(AccessTokenExpiration);
  const token = useAtomValue(AccessToken);
  const navigate = useNavigate();
  //   const [expiration, setExpiration] = useState(Date.now() + 10000);
  //   const [expiration, setExpiration] = useState(Date.now() + 5 * 60 * 1000 + 5);
  const refreshToken = useRefreshAccessToken();
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, expiration - Date.now()),
  );

  const userData = useUserData();

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
    const allUserData = () => {
      if (!userData) return false;
      if (!userData.images?.[0]?.url) return false;
      if (!userData.display_name) return false;
      return true;
    };
    if (allUserData()) {
      return (
        <div className={styles.profileWrapper}>
          {/* TODO: make this button actually log the user out and/or clear the related cache */}
          {/* TODO: make this trigger an "Are you sure?" popup */}
          <div className={styles.logoutButton} onClick={() => navigate("/")}>
            <GrLogout />
          </div>
          <img
            src={userData.images[0].url}
            alt="profile picture"
            className={styles.profilePicture}
            onError={(curr) => (curr.currentTarget.style.display = "none")}
          />
          <span className={styles.profileName}>{userData.display_name}</span>
        </div>
      );
    }
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
