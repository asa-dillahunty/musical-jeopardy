import { useAtomValue } from "jotai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AccessToken, AccessTokenExpiration } from "../util/atoms";
import { useEffect, useState } from "react";

import styles from "./sass/AppHeader.module.scss";
import { useRefreshAccessToken, useUserData } from "../util/spotifyAPI";
import { GrLogout } from "react-icons/gr";
import { isLocalEnv } from "../util/konami";

const LAST_LOGIN_DRAFT = 20;

export default function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const draftNumber = Number(/^\/login([1-9]\d*)\/*$/i.exec(pathname)?.[1]);
  const loginIndex = pathname === "/" ? 0 : draftNumber;
  const atLogin = loginIndex >= 0 && loginIndex <= LAST_LOGIN_DRAFT;
  const isLocal = isLocalEnv();
  const showLoginControls =
    atLogin && (isLocal || window.location.hostname === "localhost");

  const wordmark = (
    <>
      Musical <span>Jeopardy</span>
    </>
  );

  return (
    <header className={styles.appHeader}>
      <div className={styles.headerInner}>
        {atLogin ? (
          <div className={styles.wordmark}>{wordmark}</div>
        ) : (
          <Link to="/menu" className={styles.wordmark}>
            {wordmark}
          </Link>
        )}

        <div className={styles.headerTools}>
          {showLoginControls && (
            <nav className={styles.loginControls} aria-label="Login previews">
              <button
                type="button"
                aria-label="Previous login preview"
                disabled={loginIndex === 0}
                onClick={() => navigate(loginIndex === 1 ? "/" : `/login${loginIndex - 1}`)}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next login preview"
                disabled={loginIndex === LAST_LOGIN_DRAFT}
                onClick={() => navigate(`/login${loginIndex + 1}`)}
              >
                →
              </button>
            </nav>
          )}
          {isLocal && (
            <button
              className={styles.clearStorage}
              type="button"
              onClick={() => localStorage.clear()}
            >
              Clear local storage
            </button>
          )}
          {!atLogin && <TokenStatus />}
        </div>
      </div>
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
          <img
            src={userData.images[0].url}
            alt=""
            className={styles.profilePicture}
            onError={(curr) => (curr.currentTarget.style.display = "none")}
          />
          <span className={styles.profileName}>{userData.display_name}</span>
          <Link
            to="/"
            className={styles.logoutButton}
            aria-label="Return to sign-in"
          >
            <GrLogout aria-hidden="true" />
          </Link>
        </div>
      );
    }
    return <></>;
  }

  return (
    <div className={styles.expirationClock}>
      <ExpirationText />
      <button
        className={styles.expirationRefresh}
        type="button"
        onClick={refreshToken}
      >
        Refresh
      </button>
    </div>
  );
}
