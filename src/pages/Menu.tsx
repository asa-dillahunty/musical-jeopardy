import { konamiSetup } from "../util/konami";
import { useNavigate } from "react-router-dom";

import styles from "./sass/Menu.module.scss";

function Menu() {
  const navigate = useNavigate();

  return (
    <div className={styles.menuContainer}>
      <button className={styles.menuButton} onClick={() => navigate("/edit")}>
        Build/Edit Board
      </button>
      <button className={styles.menuButton} onClick={() => navigate("/play")}>
        Play Game
      </button>
    </div>
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
