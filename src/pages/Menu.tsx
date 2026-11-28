import { isLocalEnv } from "../util/konami";
import { FaListAlt, FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";

import styles from "./sass/Menu.module.scss";

function Menu() {
  return (
    <section className={styles.menu} aria-labelledby="main-menu-title">
      <h1 id="main-menu-title">Main Menu</h1>
      <nav aria-labelledby="main-menu-title">
        <div className={styles.tiles}>
          <Link className={styles.playTile} to="/play">
            <span className={styles.tileTop} aria-hidden="true">
              <FaPlay />
              <span>→</span>
            </span>
            <span className={styles.tileLabel}>Play Game</span>
            <span>Pick a board and host a round.</span>
          </Link>
          <Link className={styles.buildTile} to="/edit">
            <span className={styles.tileTop} aria-hidden="true">
              <FaListAlt />
              <span>→</span>
            </span>
            <span className={styles.tileLabel}>Build/Edit Board</span>
            <span>Create a board or edit an existing one.</span>
          </Link>
        </div>
        {isLocalEnv() && (
          <Link className={styles.testLink} to="/test">
            Test Page <span aria-hidden="true">→</span>
          </Link>
        )}
      </nav>
    </section>
  );
}

export const menuOptions = {
  playSelected: "play selected",
  playSelection: "play selection",
  buildSelected: "build selected",
  buildSelection: "build selection",
  mainMenu: "menu",
};

export default Menu;
