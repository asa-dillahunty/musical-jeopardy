import { Link } from "react-router-dom";
import styles from "./sass/LostPage.module.scss";

export default function LostPage() {
  return (
    <section className={styles.page} aria-labelledby="lost-page-title">
      <div className={styles.card}>
        <div className={styles.tile} aria-hidden="true">
          404
        </div>
        <div className={styles.content}>
          <h1 id="lost-page-title">Wrong note.</h1>
          <p>We couldn’t find that page. Pick where to go next.</p>
          <nav className={styles.actions} aria-label="Find your way back">
            <Link className={styles.primaryLink} to="/menu" replace>
              Main Menu <span aria-hidden="true">→</span>
            </Link>
            <Link className={styles.link} to="/" replace>
              Sign In
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
